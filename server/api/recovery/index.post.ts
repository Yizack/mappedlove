import { eq } from "drizzle-orm";

export default eventHandler(async (event) => {
  const form = await readBody(event);

  const DB = useDb();
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
    updatedAt: Date.now()
  }).where(eq(tables.users.id, user.id)).returning().get();

  if (!update) throw createError({ statusCode: ErrorCode.INTERNAL_SERVER_ERROR, message: "recovery_failed" });
  return { email: user.email };
});