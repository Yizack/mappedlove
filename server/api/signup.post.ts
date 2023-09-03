// @ts-ignore
import Mustache from "mustache";
import { randomUUID } from "crypto";

export default defineEventHandler(async (event) => {
  const form = await readBody(event);
  if (!form.turnstile) {
    throw createError({
      statusCode: 422,
      statusMessage: "Token not provided."
    });
  }

  const verify = await verifyTurnstileToken(form.turnstile, event);

  if (!verify.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Turnstile verification failed."
    });
  }

  const { secure } = useRuntimeConfig(event);
  const DB = useDb();
  const today = Date.now();
  const token = randomUUID();
  const email = form.email.toLowerCase();
  const user = await DB.insert(tables.users).values({
    email,
    password: hash(form.password, secure.salt),
    name: form.name,
    confirmCode: token,
    createdAt: today,
    updatedAt: today
  }).onConflictDoNothing().returning().get();

  if (!user) {
    throw createError({
      statusCode: 400,
      statusMessage: "User already exists."
    });
  }

  const config = useRuntimeConfig(event);
  const url = process.dev ? "http://localhost:5173" : "https://mappedlove.com";
  const template_strings = {
    verify_link: `${url}/verify/${encodeURIComponent(btoa(email))}/${token}`
  };

  const html = Mustache.render(templates.verifyAccount, template_strings);

  await sendMail(config, {
    to: { email, name: user.name},
    subject: "Verify your email address",
    html
  });

  return { user: { email: user.email } };
});
