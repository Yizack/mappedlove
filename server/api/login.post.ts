export default defineEventHandler(async (event) => {
  const { secure } = useRuntimeConfig(event);

  const validation = await readValidatedBody(event, z.object({
    email: z.email().transform(v => v.toLowerCase().trim()),
    password: z.string().transform(v => hash(v, secure.salt)),
    remember: z.boolean()
  }).safeParse);

  if (!validation.success) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "invalid_signin_data" });

  const body = validation.data;
  const DB = useDB();

  const logins = await DB.select({
    user: tables.logins.user,
    attempts: tables.logins.attempts,
    updatedAt: tables.logins.updatedAt
  }).from(tables.logins).where(eq(tables.logins.user,
    DB.select({ id: tables.users.id }).from(tables.users).where(eq(tables.users.email, body.email)).limit(1)
  )).get();

  if (!import.meta.dev && logins && logins.attempts % 3 === 0 && Date.now() - logins.updatedAt < 60000 * 5) {
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
    language: tables.users.language,
    createdAt: tables.users.createdAt,
    updatedAt: tables.users.updatedAt
  }).from(tables.users).where(and(eq(tables.users.email, body.email), eq(tables.users.password, body.password))).get();

  if (!user) {
    const userAttempted = await DB.select({ id: tables.users.id }).from(tables.users).where(eq(tables.users.email, body.email)).get();
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

  const bond = await DB.select().from(tables.bonds).where(
    or(
      eq(tables.bonds.partner1, user.id),
      eq(tables.bonds.partner2, user.id)
    )
  ).get();

  if (logins) {
    event.waitUntil(
      DB.delete(tables.logins).where(eq(tables.logins.user, logins.user)).run()
    );
  }

  if (!user.confirmed) {
    throw createError({ statusCode: ErrorCode.UNAUTHORIZED, message: "verify_error" });
  }

  const userHash = hash(user.id.toString(), secure.salt);
  const maxAge = body.remember ? 7 * 24 * 60 * 60 : 0; // if remember is true, maxAge is 7 days

  const session = { user: { ...user, bond, hash: userHash } };
  await setUserSessionNullish(event, session, { maxAge });
});
