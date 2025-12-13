export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, z.object({
    id: z.coerce.number().optional(),
    token: z.base64url().optional(),
    emailCode: z.base64url().optional()
  }).refine((data) => {
    return (data.id && !data.token && !data.emailCode) || (!data.id && data.token && data.emailCode);
  }, {
    path: ["id", "token", "emailCode"]
  }).parse);

  if (query.id) {
    const session = await requireUserSession(event);
    if (session.user.id !== query.id) {
      throw createError({ statusCode: ErrorCode.FORBIDDEN, message: "forbidden" });
    }
  }

  const userEq = query.id ? eq(tables.users.id, query.id) : eq(tables.users.email, fromBase64URL(query.emailCode!));

  const userData = await db.select().from(tables.users).where(userEq).get();

  if (!userData) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "user_not_found" });
  const { password, ...user } = userData; // Removes the password field from the user object
  const config = useRuntimeConfig(event);

  if (!query.id) {
    const token = await generateToken(event, [user.id, user.updatedAt]);
    if (token !== query.token) throw createError({ statusCode: ErrorCode.FORBIDDEN, message: "token_mismatch" });
    if (isTokenDateExpired(user.updatedAt)) throw createError({ statusCode: ErrorCode.UNAUTHORIZED, message: "account_data_expired" });
  }

  const accountData: MappedLoveAccountData = {
    user: {
      hash: hash(user.id.toString(), config.secure.salt),
      ...user
    }
  };

  const bond = await db.select().from(tables.bonds).where(
    or(
      eq(tables.bonds.partner1, user.id),
      eq(tables.bonds.partner2, user.id)
    )
  ).get();

  if (bond) {
    const bondData = {
      ...bond,
      nextPayment: bond?.nextPayment || null,
      subscriptionId: bond?.subscriptionId || undefined,
      partners: await getPartners(event, bond)
    };

    const [markers, stories] = await Promise.all([
      db.select().from(tables.markers).where(
        eq(tables.markers.bond, bond.id)
      ).orderBy(tables.markers.order).all(),

      db.select().from(tables.stories).where(
        eq(tables.stories.bond, bond.id)
      ).orderBy(desc(tables.stories.year), desc(tables.stories.month)).all()
    ]);

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
