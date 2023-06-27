export default defineEventHandler(async (event) => {
  const form = await readBody(event);
  const config = useRuntimeConfig(event);

  if (!form.turnstile) {
    throw createError({
      statusCode: 422,
      statusMessage: "Token not provided."
    });
  }

  const verify = await verifyTurnstile(config.turnstile.secretKey, form.turnstile);

  if (!verify.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Turnstile verification failed."
    });
  }

  const DB = useDb();

  const email = await DB.insert(tables.users).values({
    email: form.email.toLowerCase(),
    password: hash(form.password),
    name: form.name,
    joined: Date.now(),
    confirmed: 0
  }).onConflictDoNothing().returning({
    email: tables.users.email
  }).get();

  return { email };
});
