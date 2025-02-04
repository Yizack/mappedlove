export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, z.object({
    code: z.string(),
    email: z.string()
  }).optional().parse);

  const session = await getUserSession(event);
  let user: User;

  if (body && body.code && body.email) {
    const DB = useDB();

    const foundUser = await DB.select({
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
    )).where(eq(tables.users.email, body.email)).get();

    if (!foundUser) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "user_not_found" });
    user = foundUser;

    const config = useRuntimeConfig(event);
    const fields = [user.id, user.email, user.updatedAt, config.secure.salt];
    const codeHash = hash(fields.join());

    if (codeHash !== body.code) throw createError({ statusCode: ErrorCode.FORBIDDEN, message: "code_mismatch" });
    if (isCodeDateExpired(user.updatedAt)) throw createError({ statusCode: ErrorCode.UNAUTHORIZED, message: "account_data_expired" });
  }
  else {
    if (!session.user) throw createError({ statusCode: ErrorCode.UNAUTHORIZED, message: "user_not_found" });
    user = session.user;
  }

  if (user.bond && user.bond.subscriptionId) {
    const subscription = await getPaddleSubscription(event, user.bond.subscriptionId);
    if (subscription && subscription.status === "active" && subscription.scheduled_change?.action !== "cancel") throw createError({ statusCode: ErrorCode.FORBIDDEN, message: "premium_deleting" });
  }

  const DB = useDB();
  const deleted = await DB.delete(tables.users).where(eq(tables.users.id, user.id)).run();

  if (!deleted.success) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "user_not_found" });

  await clearUserSession(event);

  return { success: true };
});
