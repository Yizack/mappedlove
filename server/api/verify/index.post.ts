import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { email, code }= await readBody(event);

  const DB = useDb();
  const user = await DB.select({
    id: tables.users.id,
    email: tables.users.email,
    confirmed: tables.users.confirmed,
    updatedAt: tables.users.updatedAt
  }).from(tables.users).where(eq(tables.users.email, email)).get();

  if (!user) throw createError({ statusCode: 404, message: "user_not_found" });

  if (user.confirmed) return user;

  const { secure } = useRuntimeConfig(event);
  const fields = [user.id, user.email, user.updatedAt];

  const userHash = hash(fields.join(""), secure.salt);

  if (userHash !== code) throw createError({ statusCode: 403, message: "invalid_code" });

  const update = await DB.update(tables.users).set({
    confirmed: 1,
    updatedAt: Date.now()
  }).where(and(eq(tables.users.id, user.id))).returning({
    email: tables.users.email,
    confirmed: tables.users.confirmed
  }).get();

  if (!update) throw createError({ statusCode: 500, message: "verification_failed" });

  return update;
});
