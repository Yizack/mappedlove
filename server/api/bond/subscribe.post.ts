import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const payment = await readBody(event);
  if (!payment.bondId) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "bond_not_found" });
  if (!payment.subscriptionId) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "payment_error" });
  const subscription = await getPayPalSubscription(event, payment.subscriptionId);
  if (!subscription) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "invalid_subscription" });
  if (subscription.status !== "ACTIVE") throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "invalid_subscription_status" });

  const DB = useDb();
  const today = Date.now();

  await DB.update(tables.bonds).set({
    premium: 1,
    subscriptionId: payment.subscriptionId,
    nextPayment: new Date(subscription.billing_info.next_billing_time).getTime(),
    updatedAt: today
  }).where(and(eq(tables.bonds.id, payment.bondId))).run();

  return { success: true };
});
