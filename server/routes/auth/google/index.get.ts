export default defineOAuthGoogleEventHandler({
  config: {
    scope: ["email"]
  },
  async onSuccess (event, { user: _user }) {
    const DB = useDB();
    const user = await DB.select({
      id: tables.users.id,
      name: tables.users.name,
      email: tables.users.email,
      country: tables.users.country,
      birthDate: tables.users.birthDate,
      showAvatar: tables.users.showAvatar,
      language: tables.users.language,
      auth: tables.users.auth,
      confirmed: tables.users.confirmed,
      createdAt: tables.users.createdAt,
      updatedAt: tables.users.updatedAt,
      bond: tables.bonds
    }).from(tables.users).leftJoin(tables.bonds, or(
      eq(tables.bonds.partner1, tables.users.id),
      eq(tables.bonds.partner2, tables.users.id)
    )).where(and(eq(tables.users.email, _user.email))).get();

    if (!user) return sendRedirect(event, "/login?error=signin_auth_error");

    if (!user.confirmed) return sendRedirect(event, "/login?error=verify_needed");

    const { secure } = useRuntimeConfig(event);
    const userHash = hash(user.id.toString(), secure.salt);
    const remember = getQuery(event).state === "remember";
    const maxAge = remember ? 7 * 24 * 60 * 60 : 0; // if remember is true, maxAge is 7 days

    const session = { user: { ...user, hash: userHash } };
    await setUserSessionNullish(event, session, { maxAge });

    return sendRedirect(event, "/app");
  },
  onError (event, error) {
    console.warn("Google OAuth error:", error);
    return sendRedirect(event, "/");
  }
});
