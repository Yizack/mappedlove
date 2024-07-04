export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, body => z.object({
    email: z.string(),
    password: z.string()
  }).safeParse(body));

  if (!body.success) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "invalid_signin_data" });

  const form = body.data;

  const { secure } = useRuntimeConfig(event);
  const DB = useDB();

  const logins = await DB.select({
    user: tables.logins.user,
    attempts: tables.logins.attempts,
    updatedAt: tables.logins.updatedAt
  }).from(tables.logins).innerJoin(tables.users, eq(tables.users.id, tables.logins.user)).where(eq(tables.logins.user, tables.users.id)).get();

  if (logins && logins.attempts % 3 === 0 && Date.now() - logins.updatedAt < 60000 * 5) {
    throw createError({ statusCode: ErrorCode.TOO_MANY_REQUESTS, message: "many_logins_attempted" });
  }

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

  if (!user) {
    const userAttempted = await DB.select({ id: tables.users.id }).from(tables.users).where(eq(tables.users.email, form.email)).get();
    if (userAttempted) {
      await DB.insert(tables.logins).values({
        user: userAttempted.id,
        updatedAt: Date.now()
      }).onConflictDoUpdate({
        target: tables.logins.user,
        set: {
          attempts: sql`${tables.logins.attempts} + 1`,
          updatedAt: sql`excluded.updated_at`
        }
      }).run();
    }
    throw createError({ statusCode: ErrorCode.UNAUTHORIZED, message: "signin_error" });
  }

  if (logins) await DB.delete(tables.logins).where(eq(tables.logins.user, logins.user)).run();

  const session = {
    confirmed: user.confirmed
  };

  if (!user.confirmed) return session;

  const userHash = hash([user.id].join(), secure.salt);

  await setUserSession(event, { user: { ...user, hash: userHash } });
  return session;
});
