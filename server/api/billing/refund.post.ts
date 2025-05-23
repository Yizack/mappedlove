export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const body = await readValidatedBody(event, z.object({
    reason: z.string()
  }).safeParse);

  if (!body.success) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "invalid_data" });

  const refund = body.data;

  const html = `The user ${user.email} - ${user.id} has requested a refund for the following reason: ${refund.reason}`;

  const config = useRuntimeConfig(event);
  const mailchannels = useMailChannels(event);
  await mailchannels.send({
    to: {
      email: config.mailchannels.from.email,
      name: config.mailchannels.from.name
    },
    subject: `Refund Request: ${user.email}`,
    html,
    text: htmlToText(html)
  });
});
