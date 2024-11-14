export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const body = await readValidatedBody(event, body => z.object({
    reason: z.string()
  }).safeParse(body));

  if (!body.success) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "invalid_data" });

  const refund = body.data;

  const html = `The user ${user.email} - ${user.id} has requested a refund for the following reason: ${refund.reason}`;

  const appConfig = useAppConfig();
  const mailchannels = useMailChannels(event);
  await mailchannels.send({
    to: {
      email: appConfig.mailchannels.from.email,
      name: appConfig.mailchannels.from.name
    },
    subject: `Refund Request: ${user.email}`,
    html
  });

  return { success: true };
});
