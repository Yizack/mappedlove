export default defineOAuthGoogleEventHandler({
  config: {
    scope: ["email", "profile"]
  },
  async onSuccess (event, { user: google }) {
    const today = Date.now();
    const email = google.email.toLowerCase();
    const user = await db.insert(tables.users).values({
      email,
      password: null,
      name: google.given_name,
      createdAt: today,
      updatedAt: today
    }).onConflictDoNothing().returning().get();

    if (!user) return sendRedirect(event, "/signup?error=user_exists");

    const token = await generateToken(event, [user.id, user.updatedAt]);

    const { html, text } = await renderEmail("AccountVerify", {
      lang: "en",
      verifyLink: `${SITE.host}/verify/${toBase64URL(email)}/${token}`
    });

    const mailchannels = useMailChannels(event);
    const { error } = await mailchannels.send({
      to: { email, name: user.name },
      subject: "Verify your email address",
      html,
      text
    });

    if (error) {
      throw createError({
        statusCode: error.statusCode || 500,
        message: error.message
      });
    }

    return sendRedirect(event, "/login");
  },
  onError (event, error) {
    console.warn("Google OAuth error:", error);
    return sendRedirect(event, "/");
  }
});
