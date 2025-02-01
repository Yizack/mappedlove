export default defineEventHandler(async (event) => {
  const { id, code, email } = await getValidatedQuery(event, z.object({
    id: z.number({ coerce: true }).optional(),
    code: z.string().optional(),
    email: z.string().optional()
  }).refine((data) => {
    return (data.id && !data.code && !data.email) || (!data.id && data.code && data.email);
  }, {
    path: ["id", "code", "email"]
  }).parse);

  const userEq = id ? eq(tables.users.id, id) : eq(tables.users.email, atob(decodeURIComponent(email!)));

  const DB = useDB();

  const user = await DB.select({
    id: tables.users.id,
    name: tables.users.name,
    email: tables.users.email,
    country: tables.users.country,
    birthDate: tables.users.birthDate,
    showAvatar: tables.users.showAvatar,
    confirmed: tables.users.confirmed,
    createdAt: tables.users.createdAt,
    updatedAt: tables.users.updatedAt,
    bond: tables.bonds
  }).from(tables.users).leftJoin(tables.bonds, or(
    eq(tables.bonds.partner1, tables.users.id),
    eq(tables.bonds.partner2, tables.users.id)
  )).where(userEq).get();

  if (!user) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "user_not_found" });

  const config = useRuntimeConfig(event);
  if (!id) {
    const fields = [user.id, user.email, user.updatedAt, config.secure.salt];
    const codeHash = hash(fields.join());

    if (codeHash !== code) throw createError({ statusCode: ErrorCode.FORBIDDEN, message: "code_mismatch" });

    if (isCodeDateExpired(user.updatedAt)) throw createError({ statusCode: ErrorCode.UNAUTHORIZED, message: "account_data_expired" });
  }

  const accountData: MappedLoveAccountData = {
    user: {
      hash: hash(user.id.toString(), config.secure.salt),
      ...user
    }
  };

  const bond = user.bond;
  if (bond) {
    const bondData = {
      ...bond,
      nextPayment: bond?.nextPayment || null,
      subscriptionId: bond?.subscriptionId || undefined,
      partners: await getPartners(event, DB, bond)
    };

    const markers = await DB.select().from(tables.markers).where(
      eq(tables.markers.bond, bond.id)
    ).orderBy(tables.markers.order).all();

    const stories = await DB.select().from(tables.stories).where(
      eq(tables.stories.bond, bond.id)
    ).orderBy(desc(tables.stories.year), desc(tables.stories.month)).all();

    accountData.user.bond = {
      ...bondData,
      markers,
      stories
    };
  }

  setResponseHeaders(event, {
    "content-disposition": `attachment; filename="mappedlove-id${user.id}-account-data.json"`,
    "content-type": "application/json"
  });

  return JSON.stringify(accountData, null, 2);
});
