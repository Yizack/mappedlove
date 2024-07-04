export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, body => z.object({
    email: z.string(),
    code: z.string()
  }).safeParse(body));

  if (!body.success) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "invalid_verification_data" });

  const { email, code } = body.data;

  const DB = useDB();
  const user = await DB.select({
    id: tables.users.id,
    email: tables.users.email,
    confirmed: tables.users.confirmed,
    updatedAt: tables.users.updatedAt
  }).from(tables.users).where(eq(tables.users.email, email)).get();

  if (!user) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "user_not_found" });

  if (user.confirmed) return user;

  const { secure } = useRuntimeConfig(event);
  const fields = [user.id, user.email, user.updatedAt];

  const userHash = hash(fields.join(""), secure.salt);

  if (userHash !== code) throw createError({ statusCode: ErrorCode.UNAUTHORIZED, message: "invalid_code" });

  const update = await DB.update(tables.users).set({
    confirmed: 1,
    updatedAt: Date.now()
  }).where(and(eq(tables.users.id, user.id))).returning({
    email: tables.users.email,
    confirmed: tables.users.confirmed
  }).get();

  if (!update) throw createError({ statusCode: ErrorCode.INTERNAL_SERVER_ERROR, message: "verification_failed" });

  return update;
});
