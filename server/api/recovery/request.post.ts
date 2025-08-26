import { render } from "@vue-email/render";
import accountRecovery from "~~/emails/accountRecovery.vue";

export default defineEventHandler(async (event) => {
  const validation = await readValidatedBody(event, z.object({
    email: z.email().transform(v => v.toLowerCase().trim())
  }).safeParse);

  if (!validation.success) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "email_required" });

  const body = validation.data;

  const DB = useDB();
  const user = await DB.update(tables.users).set({
    updatedAt: Date.now()
  }).where(eq(tables.users.email, body.email)).returning().get();

  if (!user) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "user_not_found" });

  const token = await generateToken(event, [user.id, user.updatedAt]);

  const html = await render(accountRecovery, {
    lang: "en",
    recoveryLink: `${SITE.host}/recovery/${toBase64URL(user.email)}/${token}`
  });

  const mailchannels = useMailChannels(event);
  await mailchannels.send({
    to: { email: user.email, name: user.name },
    subject: "Account recovery",
    html,
    text: htmlToText(html)
  });
});
