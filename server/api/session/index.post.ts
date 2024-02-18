import { eq, and, or } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const form = await readBody(event);
  const { secure } = useRuntimeConfig(event);
  const DB = useDb();

  const user = await DB.select({
    id: tables.users.id,
    name: tables.users.name,
    email: tables.users.email,
    country: tables.users.country,
    birthDate: tables.users.birthDate,
    showAvatar: tables.users.showAvatar,
    confirmed: tables.users.confirmed,
    createdAt: tables.users.createdAt,
    updatedAt: tables.users.updatedAt
  }).from(tables.users).where(and(eq(tables.users.email, form.email), eq(tables.users.password, hash(form.password, secure.salt)))).get();

  if (!user) throw createError({ statusCode: ErrorCode.UNAUTHORIZED, message: "signin_error" });

  const bond = await DB.select().from(tables.bonds).where(
    or(
      eq(tables.bonds.partner1, user.id),
      eq(tables.bonds.partner2, user.id)
    )
  ).get();

  const session = {
    confirmed: user.confirmed,
  };

  if (!user.confirmed) return session;

  const userHash = hash([user.id].join(), secure.salt);

  await setUserSession(event, { user: { ...user, hash: userHash, bond } });
  return session;
});
