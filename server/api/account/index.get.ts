export default defineEventHandler(async (event) => {
  const { code, email } = await getValidatedQuery(event, z.object({
    code: z.string(),
    email: z.string()
  }).parse);

  const decodedEmail = atob(decodeURIComponent(email));
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
    updatedAt: tables.users.updatedAt
  }).from(tables.users).where(eq(tables.users.email, decodedEmail)).get();

  if (!user) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "user_not_found" });

  const config = useRuntimeConfig(event);
  const fields = [user.id, user.email, user.updatedAt];
  const codeHash = hash(fields.join(""), config.secure.salt);

  if (codeHash !== code) throw createError({ statusCode: ErrorCode.FORBIDDEN, message: "code_mismatch" });

  if (isCodeDateExpired(user.updatedAt)) throw createError({ statusCode: ErrorCode.UNAUTHORIZED, message: "account_data_expired" });

  const accountData: MappedLoveAccountData = {
    user: {
      ...user,
      hash: codeHash
    }
  };

  const bond = await DB.select().from(tables.bonds).where(
    or(
      eq(tables.bonds.partner1, user.id),
      eq(tables.bonds.partner2, user.id)
    )
  ).get();

  if (bond) {
    const partner1 = await DB.select({
      id: tables.users.id,
      name: tables.users.name,
      showAvatar: tables.users.showAvatar,
      country: tables.users.country,
      updatedAt: tables.users.updatedAt
    }).from(tables.users).where(eq(tables.users.id, Number(bond?.partner1))).get();

    const partner2 = await DB.select({
      id: tables.users.id,
      name: tables.users.name,
      showAvatar: tables.users.showAvatar,
      country: tables.users.country,
      updatedAt: tables.users.updatedAt
    }).from(tables.users).where(eq(tables.users.id, Number(bond?.partner2))).get();

    const bondData = {
      ...bond,
      nextPayment: bond?.nextPayment || null,
      subscriptionId: bond?.subscriptionId || undefined,
      partner1: partner1 ? {
        ...partner1,
        hash: hash([partner1?.id].join(), config.secure.salt)
      } : null,
      partner2: partner2 ? {
        ...partner2,
        hash: hash([partner2?.id].join(), config.secure.salt)
      } : null
    };

    const stories = await DB.select().from(tables.stories).where(eq(tables.stories.bond, bond.id)).all();
    const markers = await DB.select().from(tables.markers).where(eq(tables.markers.bond, bond.id)).all();

    accountData.user.bond = {
      ...bondData,
      stories,
      markers
    };
  }

  setResponseHeaders(event, {
    "content-disposition": `attachment; filename="mappedlove-id${user.id}-account-data.json"`,
    "content-type": "application/json"
  });

  return accountData;
});
