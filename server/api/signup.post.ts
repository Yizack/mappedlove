import { randomUUID } from "crypto";

export default defineEventHandler(async (event) => {
  const form = await readBody(event);
  // @ts-ignore
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
  await sendMail(config, {
    to: {
      email,
      name: user.name
    },
    subject: "Verify your email address",
    html: `Welcome to Mapped Love! to verify your email, click on the link below:<br/><br/><a href="${url}/verify/${encodeURIComponent(btoa(email))}/${token}">Verify Email</a><br/><br/>If you did not sign up for Mapped Love, please ignore this email.`
  });

  return { user: { email: user.email } };
});
