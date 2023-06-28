import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const form = await readBody(event);
  const DB = useDb();
  const user = await DB.select({
    id: tables.users.id,
    name: tables.users.name,
    email: tables.users.email,
    showAvatar: tables.users.showAvatar
  }).from(tables.users).where(and(eq(tables.users.email, form.email), eq(tables.users.password, hash(form.password)))).get();
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized"
    });
  }

  return setUserSession(event, { user });
});
