// @ts-ignore
import Mustache from "mustache";
import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const payment = await readBody(event);
  if (!payment.bondId) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "bond_not_found" });
  if (!payment.transactionId) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "payment_error" });
  const subscription = await getPaddleSubscription(event, payment.transactionId);
  if (!subscription) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "invalid_subscription" });
  if (subscription.status !== "active" && subscription.status !== "trialing") throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "invalid_subscription_status" });
  if (!subscription.current_billing_period) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "invalid_subscription_period" });

  const DB = useDb();
  const today = Date.now();

  const update = await DB.update(tables.bonds).set({
    premium: 1,
    subscriptionId: payment.subscriptionId,
    nextPayment: new Date(subscription.current_billing_period.ends_at).getTime(),
    updatedAt: today
  }).where(and(eq(tables.bonds.id, payment.bondId))).returning().get();

  if (!update) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "bond_not_found" });

  const html = Mustache.render(templates.premiumWelcome, {
    // nextPayment: new Date(subscription.billing_info.next_billing_time).toLocaleDateString(),
  });

  const config = useRuntimeConfig(event);

  await sendMail(config, {
    to: {
      email: user.email,
      name: user.name
    },
    subject: "Premium subscription activated!",
    html
  });

  await setUserSession(event, { user: { ...user, bond: { ...user.bond, ...update } }});

  return { success: true };
});
