import { render } from "@vue-email/render";
import premiumWelcome from "~~/email/premiumWelcome.vue";

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);

  const body = await readValidatedBody(event, z.object({
    bondId: z.number(),
    transactionId: z.string()
  }).safeParse);

  if (!body.success) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "invalid_payment_data" });

  const payment = body.data;

  if (payment.bondId !== session.user.bond?.id) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "bond_not_found" });

  const transaction = await getPaddleTransaction(event, payment.transactionId);
  if (!transaction) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "transaction_not_found" });
  if (transaction.status !== "paid" && transaction.status !== "ready") {
    if (!transaction.subscription_id) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "subscription_not_found" });
    const subscription = await getPaddleSubscription(event, transaction.subscription_id);
    if (subscription && subscription.status !== "active") throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "subscription_not_active" });
  }

  const DB = useDB();
  const today = Date.now();

  const update = await DB.update(tables.bonds).set({
    premium: true,
    nextPayment: today + 1 * 24 * 60 * 60 * 1000, // 1 day grace period
    updatedAt: today
  }).where(and(eq(tables.bonds.id, payment.bondId))).returning({
    premium: tables.bonds.premium,
    nextPayment: tables.bonds.nextPayment,
    updatedAt: tables.bonds.updatedAt
  }).get();

  if (!update) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "bond_not_found" });

  if (transaction.origin === "web" && !session.user.bond.premium) {
    const html = await render(premiumWelcome, {
      lang: "en"
    });

    session.user = { ...session.user, bond: { ...session.user.bond, ...update } };
    await setUserSessionNullish(event, session);

    const mailchannels = useMailChannels(event);
    await mailchannels.send({
      to: {
        email: session.user.email,
        name: session.user.name
      },
      subject: "Premium subscription activated!",
      html
    });
  }

  return { success: true };
});
