export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, z.object({
    email: z.email().transform(v => v.toLowerCase().trim()),
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

  const DB = useDB();
  const user = await DB.update(tables.users).set({
    updatedAt: Date.now()
  }).where(eq(tables.users.email, body.email)).returning().get();

  if (!user) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "user_not_found" });

  const token = await generateToken(event, [user.id, user.updatedAt]);

  const { html, text } = await renderEmail("AccountData", {
    lang: "en",
    requestLink: `${SITE.host}/account-data/${toBase64URL(body.email)}/${token}?request=${body.request}`,
    request: body.request
  });

  const mailchannels = useMailChannels(event);
  await mailchannels.send({
    to: { email: body.email, name: user.name },
    subject: "Account data request",
    html,
    text
  });
});
