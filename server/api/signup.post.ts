// @ts-ignore
import Mustache from "mustache";

export default defineEventHandler(async (event) => {
  const form = await readBody(event);
  if (!form.turnstile) {
    throw createError({
      statusCode: 422,
      message: "token_missing"
    });
  }

  const verify = await verifyTurnstileToken(form.turnstile, event);

  if (!verify.success) {
    throw createError({
      statusCode: 400,
      message: "turnstile_failed"
    });
  }

  const config = useRuntimeConfig(event);
  const DB = useDb();
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
      statusCode: 400,
      message: "user_exists"
    });
  }

  const fields = [user.id, user.email, user.updatedAt];
  const code = hash(fields.join(""), config.secure.salt);

  const url = process.dev ? "http://localhost:5173" : "https://mappedlove.com";
  const template_strings = {
    verify_link: `${url}/verify/${encodeURIComponent(btoa(email))}/${code}`
  };

  const html = Mustache.render(templates.verifyAccount, template_strings);

  await sendMail(config, {
    to: { email, name: user.name },
    subject: "Verify your email address",
    html
  });

  return { user: { email: user.email } };
});
