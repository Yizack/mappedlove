import Mustache from "mustache";

export default oauth.googleEventHandler({
  config: {
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile"
    ]
  },
  async onSuccess (event, { user: google }) {
    const config = useRuntimeConfig(event);
    const DB = useDb();
    const today = Date.now();
    const email = google.email.toLowerCase();
    const user = await DB.insert(tables.users).values({
      email,
      password: null,
      name: google.given_name,
      auth: 1,
      createdAt: today,
      updatedAt: today
    }).onConflictDoNothing().returning().get();

    if (!user) return sendRedirect(event, "/signup?error=user_exists");

    const fields = [user.id, user.email, user.updatedAt];
    const code = hash(fields.join(""), config.secure.salt);

    const url = import.meta.dev ? SITE.dev : SITE.host;

    const html = Mustache.render(templates.accountVerify, {
      lang: "en",
      domain: SITE.domain,
      verifyLink: `${url}/verify/${encodeURIComponent(btoa(email))}/${code}`
    });

    await sendMail(config, {
      to: { email, name: user.name },
      subject: "Verify your email address",
      html
    });

    return sendRedirect(event, "/login");
  },
  onError (event, error) {
    console.warn("Google OAuth error:", error);
    return sendRedirect(event, "/");
  }
});
