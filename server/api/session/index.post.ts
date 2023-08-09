import { eq, and, or } from "drizzle-orm";

export default defineEventHandler(async (event) : Promise<MappedLoveSession> => {
  const form = await readBody(event);
  const { secure } = useRuntimeConfig(event);
  const DB = useDb();
  const user = await DB.select({
    id: tables.users.id,
    name: tables.users.name,
    email: tables.users.email,
    showAvatar: tables.users.showAvatar,
    confirmed: tables.users.confirmed
  }).from(tables.users).where(and(eq(tables.users.email, form.email), eq(tables.users.password, hash(form.password, secure.salt)))).get();

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized"
    });
  }

  const bond = await DB.select().from(tables.bonds).where(
    or(
      eq(tables.bonds.partner1, user.id),
      eq(tables.bonds.partner2, user.id)
    )
  ).get();

  const userInfo = {
    user: {
      ...user,
      bond
    }
  };

  if (!user.confirmed) return userInfo;
  return setUserSession(event, userInfo);
});
