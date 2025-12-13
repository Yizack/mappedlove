export default defineEventHandler(async (event) => {
  const validation = await readValidatedBody(event, z.object({
    email: z.email().transform(v => v.toLowerCase().trim()),
    password: z.string(),
    name: z.string(),
    turnstile: z.string()
  }).safeParse);

  if (!validation.success) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "invalid_signup_data" });

  const body = validation.data;

  if (!body.turnstile) {
    throw createError({
      statusCode: ErrorCode.UNPROCESSABLE_ENTITY,
      message: "token_missing"
    });
  }

  const verify = await verifyTurnstileToken(body.turnstile, event);

  if (!verify.success) {
    throw createError({
      statusCode: ErrorCode.BAD_REQUEST,
      message: "turnstile_failed"
    });
  }

  if (!isValidPassword(body.password)) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "password_invalid" });

  const { secure } = useRuntimeConfig(event);

  const today = Date.now();
  const user = await db.insert(tables.users).values({
    email: body.email,
    password: hash(body.password, secure.salt),
    name: body.name,
    createdAt: today,
    updatedAt: today
  }).onConflictDoNothing().returning().get();

  if (!user) {
    throw createError({
      statusCode: ErrorCode.CONFLICT,
      message: "user_exists"
    });
  }

  const token = await generateToken(event, [user.id, user.updatedAt]);

  const { html, text } = await renderEmail("AccountVerify", {
    lang: "en",
    verifyLink: `${SITE.host}/verify/${toBase64URL(user.email)}/${token}`
  });

  const mailchannels = useMailChannels(event);
  await mailchannels.send({
    to: { email: user.email, name: user.name },
    subject: "Verify your email address",
    html,
    text
  });
});
