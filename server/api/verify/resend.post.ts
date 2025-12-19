export default defineEventHandler(async (event) => {
  const validation = await readValidatedBody(event, z.object({
    email: z.email().transform(v => v.toLowerCase().trim())
  }).safeParse);

  if (!validation.success) throw createError({ status: ErrorCode.BAD_REQUEST, message: "email_required" });

  const body = validation.data;

  const user = await db.select({
    id: tables.users.id,
    name: tables.users.name,
    email: tables.users.email,
    confirmed: tables.users.confirmed,
    updatedAt: tables.users.updatedAt
  }).from(tables.users).where(eq(tables.users.email, body.email)).get();

  if (!user) throw createError({ status: ErrorCode.NOT_FOUND, message: "user_not_found" });

  if (user.confirmed) throw createError({ status: ErrorCode.CONFLICT, message: "email_verified" });

  const token = await generateToken(event, [user.id, user.updatedAt]);

  const { html, text } = await renderEmail("AccountVerify", {
    lang: "en",
    verifyLink: `${SITE.host}/verify/${toBase64URL(user.email)}/${token}`
  });

  const mailchannels = useMailChannels(event);
  const { error } = await mailchannels.send({
    to: { email: body.email, name: user.name },
    subject: "Verify your email address",
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
