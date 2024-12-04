import { render } from "@vue-email/render";
import accountVerify from "~~/emails/accountVerify.vue";

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, body => z.object({
    email: z.string(),
    password: z.string(),
    name: z.string(),
    turnstile: z.string()
  }).safeParse(body));

  if (!body.success) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "invalid_signup_data" });

  const form = body.data;

  if (!form.turnstile) {
    throw createError({
      statusCode: ErrorCode.UNPROCESSABLE_ENTITY,
      message: "token_missing"
    });
  }

  const verify = await verifyTurnstileToken(form.turnstile, event);

  if (!verify.success) {
    throw createError({
      statusCode: ErrorCode.BAD_REQUEST,
      message: "turnstile_failed"
    });
  }

  if (!isPasswordValid(form.password)) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "password_invalid" });

  const config = useRuntimeConfig(event);
  const DB = useDB();
  const today = Date.now();
  const email = form.email.toLowerCase();
  const user = await DB.insert(tables.users).values({
    email,
    password: hash(form.password, config.secure.salt),
    name: form.name,
    createdAt: today,
    updatedAt: today
  }).onConflictDoNothing().returning().get();

  if (!user) {
    throw createError({
      statusCode: ErrorCode.BAD_REQUEST,
      message: "user_exists"
    });
  }

  const fields = [user.id, user.email, user.updatedAt];
  const code = hash(fields.join(""), config.secure.salt);

  const url = import.meta.dev ? SITE.dev : SITE.host;

  const html = await render(accountVerify, {
    lang: "en",
    domain: SITE.domain,
    verifyLink: `${url}/verify/${encodeURIComponent(btoa(email))}/${code}`
  });

  const mailchannels = useMailChannels(event);
  await mailchannels.send({
    to: { email, name: user.name },
    subject: "Verify your email address",
    html
  });

  return { user: { email: user.email } };
});
