import { render } from "@vue-email/render";
import accountData from "~~/emails/accountData.vue";

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, z.object({
    email: z.string(),
    request: z.string(),
    turnstile: z.string()
  }).parse);

  const verify = await verifyTurnstileToken(body.turnstile, event);

  if (!verify.success) {
    throw createError({
      statusCode: ErrorCode.BAD_REQUEST,
      message: "turnstile_failed"
    });
  }

  const email = body.email.toLowerCase();

  const DB = useDB();
  const user = await DB.update(tables.users).set({
    updatedAt: Date.now()
  }).where(eq(tables.users.email, email)).returning().get();

  if (!user) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "user_not_found" });

  const config = useRuntimeConfig(event);
  const fields = [user.id, user.email, user.updatedAt, config.secure.salt];
  const code = hash(fields.join());

  const html = await render(accountData, {
    lang: "en",
    requestLink: `${SITE.host}/account-data/${encodeURIComponent(btoa(email))}/${code}?request=${body.request}`,
    request: body.request
  });

  const mailchannels = useMailChannels(event);
  await mailchannels.send({
    to: { email, name: user.name },
    subject: "Account data request",
    html,
    text: htmlToText(html)
  });

  return { success: true };
});
