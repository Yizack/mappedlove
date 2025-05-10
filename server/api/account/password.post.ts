export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { secure } = useRuntimeConfig(event);
  const body = await readValidatedBody(event, z.object({
    new_password: z.string()
  }).safeParse);

  if (!body.success || !isValidPassword(body.data.new_password)) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "password_invalid" });

  const form = body.data;

  const DB = useDB();
  const update = await DB.update(tables.users).set({
    password: hash(form.new_password, secure.salt),
    updatedAt: Date.now()
  }).where(eq(tables.users.id, user.id)).returning({
    updatedAt: tables.users.updatedAt
  }).get();

  if (!update) throw createError({ statusCode: ErrorCode.UNAUTHORIZED, message: "password_error" });

  delete user.passwordless;
  const session = { user: { ...user, ...update } };
  await setUserSessionNullish(event, session);
});
