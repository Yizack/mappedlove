export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const validation = await readValidatedBody(event, z.object({
    new_password: z.string()
  }).safeParse);

  if (!validation.success || !isValidPassword(validation.data.new_password)) throw createError({ status: ErrorCode.BAD_REQUEST, message: "password_invalid" });

  const body = validation.data;

  const { secure } = useRuntimeConfig(event);

  const update = await db.update(tables.users).set({
    password: hash(body.new_password, secure.salt),
    updatedAt: Date.now()
  }).where(eq(tables.users.id, user.id)).returning({
    updatedAt: tables.users.updatedAt
  }).get();

  if (!update) throw createError({ status: ErrorCode.UNAUTHORIZED, message: "password_error" });

  delete user.passwordless;
  const session = { user: { ...user, ...update } };
  await setUserSessionNullish(event, session);
});
