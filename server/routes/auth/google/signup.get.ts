import { render } from "@vue-email/render";
import accountVerify from "~~/emails/accountVerify.vue";

export default defineOAuthGoogleEventHandler({
  config: {
    scope: ["email", "profile"]
  },
  async onSuccess (event, { user: google }) {
    const config = useRuntimeConfig(event);
    const DB = useDB();
    const today = Date.now();
    const email = google.email.toLowerCase();
    const user = await DB.insert(tables.users).values({
      email,
      password: null,
      name: google.given_name,
      createdAt: today,
      updatedAt: today
    }).onConflictDoNothing().returning().get();

    if (!user) return sendRedirect(event, "/signup?error=user_exists");

    const fields = [user.id, user.email, user.updatedAt, config.secure.salt];
    const code = hash(fields.join());

    const html = await render(accountVerify, {
      lang: "en",
      verifyLink: `${SITE.host}/verify/${encodeURIComponent(btoa(email))}/${code}`
    });

    const mailchannels = useMailChannels(event);
    await mailchannels.send({
      to: { email, name: user.name },
      subject: "Verify your email address",
      html,
      text: htmlToText(html)
    });

    return sendRedirect(event, "/login");
  },
  onError (event, error) {
    console.warn("Google OAuth error:", error);
    return sendRedirect(event, "/");
  }
});
