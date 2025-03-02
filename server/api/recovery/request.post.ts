import { render } from "@vue-email/render";
import accountRecovery from "~~/emails/accountRecovery.vue";

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, z.object({
    email: z.string()
  }).safeParse);

  if (!body.success) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "email_required" });

  const form = body.data;

  const email = form.email.toLowerCase();

  const DB = useDB();
  const user = await DB.update(tables.users).set({
    updatedAt: Date.now()
  }).where(eq(tables.users.email, email)).returning().get();

  if (!user) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "user_not_found" });

  const config = useRuntimeConfig(event);
  const fields = [user.id, user.email, user.updatedAt, config.secure.salt];
  const code = await hash(fields.join());

  const html = await render(accountRecovery, {
    lang: "en",
    recoveryLink: `${SITE.host}/recovery/${encodeURIComponent(btoa(user.email))}/${code}`
  });

  const mailchannels = useMailChannels(event);
  await mailchannels.send({
    to: { email, name: user.name },
    subject: "Account recovery",
    html,
    text: htmlToText(html)
  });

  return { code };
});
