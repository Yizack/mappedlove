export default defineEventHandler(async (event): Promise<User> => {
  const session = await requireUserSession(event);
  const { secure } = useRuntimeConfig(event);
  const body = await readValidatedBody(event, body => z.object({
    new_password: z.string()
  }).safeParse(body));

  if (!body.success || !isValidPassword(body.data.new_password)) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "password_invalid" });

  const form = body.data;

  const DB = useDB();
  const update = await DB.update(tables.users).set({
    password: hash(form.new_password, secure.salt),
    auth: false,
    updatedAt: Date.now()
  }).where(and(eq(tables.users.id, session.user.id), eq(tables.users.auth, true))).returning({
    auth: tables.users.auth,
    updatedAt: tables.users.updatedAt
  }).get();

  if (!update) throw createError({ statusCode: ErrorCode.UNAUTHORIZED, message: "password_error" });

  session.user = { ...session.user, ...update };
  await setUserSessionNullish(event, session);

  return session.user;
});
