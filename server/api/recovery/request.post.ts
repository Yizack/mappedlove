export default defineEventHandler(async (event) => {
  const validation = await readValidatedBody(event, z.object({
    email: z.email().transform(v => v.toLowerCase().trim())
  }).safeParse);

  if (!validation.success) throw createError({ status: ErrorCode.BAD_REQUEST, message: "email_required" });

  const body = validation.data;

  const user = await db.update(tables.users).set({
    updatedAt: Date.now()
  }).where(eq(tables.users.email, body.email)).returning().get();

  if (!user) throw createError({ status: ErrorCode.NOT_FOUND, message: "user_not_found" });

  const token = await generateToken(event, [user.id, user.updatedAt]);

  const { html, text } = await renderEmail("AccountRecovery", {
    lang: "en",
    recoveryLink: `${SITE.host}/recovery/${toBase64URL(user.email)}/${token}`
  });

  const mailchannels = useMailChannels(event);
  const { error } = await mailchannels.send({
    to: { email: user.email, name: user.name },
    subject: "Account recovery",
    html,
    text
  });

  if (error) {
    throw createError({
      status: error.statusCode || 500,
      message: error.message
    });
  }
});
