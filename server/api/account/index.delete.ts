export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, z.object({
    token: z.base64url(),
    email: z.email().transform(v => v.toLowerCase().trim())
  }).optional().parse);

  const session = await getUserSession(event);
  let user: Pick<User, "id" | "email" | "updatedAt" | "bond">;

  const config = useRuntimeConfig(event);

  if (body && body.token && body.email) {
    const DB = useDB();

    const foundUser = await DB.select({
      id: tables.users.id,
      name: tables.users.name,
      email: tables.users.email,
      updatedAt: tables.users.updatedAt,
      bond: tables.bonds
    }).from(tables.users).leftJoin(tables.bonds, or(
      eq(tables.bonds.partner1, tables.users.id),
      eq(tables.bonds.partner2, tables.users.id)
    )).where(eq(tables.users.email, body.email)).get();

    if (!foundUser) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "user_not_found" });
    user = foundUser;

    const token = await generateToken(event, [user.id, user.updatedAt]);

    if (token !== body.token) throw createError({ statusCode: ErrorCode.FORBIDDEN, message: "code_mismatch" });
    if (isTokenDateExpired(user.updatedAt)) throw createError({ statusCode: ErrorCode.UNAUTHORIZED, message: "account_data_expired" });
  }
  else {
    if (!session.user) throw createError({ statusCode: ErrorCode.UNAUTHORIZED, message: "user_not_found" });
    user = session.user;
  }

  if (user.bond && user.bond.subscriptionId) {
    const paddle = new Paddle(config.paddle.secret);
    const subscription = await paddle.getPaddleSubscription(user.bond.subscriptionId);
    if (subscription && subscription.data.status === "active" && subscription.data.scheduled_change?.action !== "cancel") {
      throw createError({ statusCode: ErrorCode.FORBIDDEN, message: "premium_deleting" });
    }
  }

  const DB = useDB();
  event.waitUntil(
    DB.delete(tables.users).where(eq(tables.users.id, user.id)).run()
  );

  await clearUserSession(event);
});
