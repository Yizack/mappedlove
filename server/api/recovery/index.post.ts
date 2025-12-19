export default defineEventHandler(async (event) => {
  const validation = await readValidatedBody(event, z.object({
    email: z.email().transform(v => v.toLowerCase().trim()),
    token: z.base64url(),
    password: z.string()
  }).safeParse);

  if (!validation.success) throw createError({ status: ErrorCode.BAD_REQUEST, message: "invalid_recovery_data" });

  const body = validation.data;

  if (!isValidPassword(body.password)) throw createError({ status: ErrorCode.BAD_REQUEST, message: "password_invalid" });

  const user = await db.select({
    id: tables.users.id,
    email: tables.users.email,
    updatedAt: tables.users.updatedAt
  }).from(tables.users).where(eq(tables.users.email, body.email)).get();

  if (!user) throw createError({ status: ErrorCode.NOT_FOUND, message: "user_not_found" });

  const token = await generateToken(event, [user.id, user.updatedAt]);

  if (token !== body.token) throw createError({ status: ErrorCode.UNAUTHORIZED, message: "invalid_recovery" });

  if (isTokenDateExpired(user.updatedAt)) throw createError({ status: ErrorCode.UNAUTHORIZED, message: "recovery_expired" });

  const { secure } = useRuntimeConfig(event);
  await db.update(tables.users).set({
    password: hash(body.password, secure.salt),
    updatedAt: Date.now()
  }).where(eq(tables.users.id, user.id)).run();
});
