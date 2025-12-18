export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const validation = await readValidatedBody(event, z.object({
    reason: z.string()
  }).safeParse);

  if (!validation.success) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "invalid_data" });

  const body = validation.data;

  const text = `The user ${user.email} - ${user.id} has requested a refund for the following reason: ${body.reason}`;

  const config = useRuntimeConfig(event);
  const mailchannels = useMailChannels(event);
  const { error } = await mailchannels.send({
    to: {
      email: config.mailchannels.from.email,
      name: config.mailchannels.from.name
    },
    subject: `Refund Request: ${user.email}`,
    html: text,
    text
  });

  if (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message
    });
  }
});
