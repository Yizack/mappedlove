import { render } from "@vue-email/render";
import premiumWelcome from "~~/emails/premiumWelcome.vue";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const validation = await readValidatedBody(event, z.object({
    bondId: z.number(),
    transactionId: z.string()
  }).safeParse);

  if (!validation.success) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "invalid_payment_data" });

  const body = validation.data;

  if (body.bondId !== user.bond?.id) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "bond_not_found" });

  const config = useRuntimeConfig(event);
  const paddle = new Paddle(config.paddle.secret);

  const transaction = await paddle.getPaddleTransaction(body.transactionId);
  if (!transaction) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "transaction_not_found" });
  if (transaction.data.status !== "paid" && transaction.data.status !== "ready") {
    if (!transaction.data.subscription_id) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "subscription_not_found" });
    const subscription = await paddle.getPaddleSubscription(transaction.data.subscription_id);
    if (subscription && subscription.data.status !== "active") throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "subscription_not_active" });
  }

  const DB = useDB();
  const today = Date.now();

  const update = await DB.update(tables.bonds).set({
    premium: true,
    nextPayment: today + 1 * 24 * 60 * 60 * 1000, // 1 day grace period
    updatedAt: today
  }).where(and(eq(tables.bonds.id, body.bondId))).returning({
    premium: tables.bonds.premium,
    nextPayment: tables.bonds.nextPayment,
    updatedAt: tables.bonds.updatedAt
  }).get();

  if (!update) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "bond_not_found" });

  if (transaction.data.origin === "web" && !user.bond.premium) {
    const html = await render(premiumWelcome, {
      lang: "en"
    });

    const session = { user: { ...user, bond: { ...user.bond, ...update } } };
    await setUserSessionNullish(event, session);

    const mailchannels = useMailChannels(event);
    await mailchannels.send({
      to: {
        email: user.email,
        name: user.name
      },
      subject: "Premium subscription activated!",
      html,
      text: htmlToText(html)
    });
  }
});
