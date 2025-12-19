export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const validation = await readValidatedBody(event, z.object({
    current_password: z.string(),
    new_password: z.string()
  }).safeParse);

  if (!validation.success || !isValidPassword(validation.data.new_password)) throw createError({ status: ErrorCode.BAD_REQUEST, message: "password_invalid" });

  const body = validation.data;

  const { secure } = useRuntimeConfig(event);

  await db.update(tables.users).set({
    password: hash(body.new_password, secure.salt),
    updatedAt: Date.now()
  }).where(and(eq(tables.users.id, user.id), eq(tables.users.password, hash(body.current_password, secure.salt)))).run();
});
