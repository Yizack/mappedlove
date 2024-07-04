export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, body => z.object({
    email: z.string(),
    code: z.string(),
    password: z.string()
  }).safeParse(body));

  if (!body.success) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "invalid_recovery_data" });

  const form = body.data;

  if (!isPasswordValid(form.password)) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "password_invalid" });

  const DB = useDB();
  const user = await DB.select({
    id: tables.users.id,
    email: tables.users.email,
    updatedAt: tables.users.updatedAt
  }).from(tables.users).where(eq(tables.users.email, form.email)).get();

  if (!user) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "user_not_found" });

  const { secure } = useRuntimeConfig(event);

  const fields = [user.id, user.email, user.updatedAt];
  const userHash = hash(fields.join(""), secure.salt);

  if (userHash !== form.code) throw createError({ statusCode: ErrorCode.UNAUTHORIZED, message: "invalid_recovery" });

  if (isCodeDateExpired(user.updatedAt)) throw createError({ statusCode: ErrorCode.UNAUTHORIZED, message: "recovery_expired" });

  const update = await DB.update(tables.users).set({
    password: hash(form.password, secure.salt),
    auth: 0,
    updatedAt: Date.now()
  }).where(eq(tables.users.id, user.id)).returning().get();

  if (!update) throw createError({ statusCode: ErrorCode.INTERNAL_SERVER_ERROR, message: "recovery_failed" });
  return { email: user.email };
});
