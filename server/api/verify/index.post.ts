import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";

export default defineEventHandler(async (event) => {
  const { email, token }= await readBody(event);
  const DB = useDb();
  const user = await DB.select({
    email: tables.users.email,
    confirmed: tables.users.confirmed
  }).from(tables.users).where(eq(tables.users.email, email)).get();

  if (!user) throw createError({ statusCode: 404, message: "user_not_found" });

  if (user.confirmed) return user;

  return DB.update(tables.users).set({
    confirmed: 1,
    confirmCode: randomUUID(),
    updatedAt: Date.now()
  }).where(and(eq(tables.users.email, email), eq(tables.users.confirmCode, token))).returning({
    email: tables.users.email,
    confirmed: tables.users.confirmed
  }).get();
});
