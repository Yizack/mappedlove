export default defineEventHandler(async (event) => {
  const validation = await readValidatedBody(event, z.object({
    email: z.email().transform(v => v.toLowerCase().trim()),
    token: z.base64url()
  }).safeParse);

  if (!validation.success) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "invalid_verification_data" });

  const body = validation.data;

  const DB = useDB();
  const user = await DB.select({
    id: tables.users.id,
    email: tables.users.email,
    confirmed: tables.users.confirmed,
    updatedAt: tables.users.updatedAt
  }).from(tables.users).where(eq(tables.users.email, body.email)).get();

  if (!user) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "user_not_found" });

  if (user.confirmed) return user;

  const token = await generateToken(event, [user.id, user.updatedAt]);

  if (token !== body.token) throw createError({ statusCode: ErrorCode.UNAUTHORIZED, message: "invalid_token" });

  await DB.update(tables.users).set({
    confirmed: true,
    updatedAt: Date.now()
  }).where(eq(tables.users.id, user.id)).run();
});
