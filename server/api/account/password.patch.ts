export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { secure } = useRuntimeConfig(event);
  const body = await readValidatedBody(event, z.object({
    current_password: z.string(),
    new_password: z.string()
  }).safeParse);

  if (!body.success || !isValidPassword(body.data.new_password)) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "password_invalid" });

  const form = body.data;

  const DB = useDB();
  await DB.update(tables.users).set({
    password: hash(form.new_password, secure.salt),
    updatedAt: Date.now()
  }).where(and(eq(tables.users.id, user.id), eq(tables.users.password, hash(form.current_password, secure.salt)))).run();
});
