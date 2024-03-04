import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const webhook = await readBody(event);
  const headers = getHeaders(event);

  //if (!headers) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "Invalid headers" });
  console.info(webhook);
  //const isValidWebhook = await isValidPaddleWebhook(event, headers, webhook);
  //console.info(isValidWebhook);
  //if (!isValidWebhook) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "Invalid webhook" });

  const DB = useDb();
  const today = Date.now();

  /*
  if (webhook.event_type === PayPalWebhook.PAYMENT_SALE_COMPLETED) {
    if (webhook.resource.state !== "completed" || !webhook.resource.custom || !webhook.resource.billing_agreement_id) return;
    const subscription = await getPayPalSubscription(event, webhook.resource.billing_agreement_id);
    if (!subscription) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "Invalid subscription" });
    if (subscription.status !== "ACTIVE") throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "Invalid subscription status" });

    await DB.update(tables.bonds).set({
      premium: 1,
      subscriptionId: subscription.id,
      nextPayment: new Date(subscription.billing_info.next_billing_time).getTime(),
      updatedAt: today
    }).where(and(eq(tables.bonds.id, Number(webhook.resource.custom)))).run();
  }
  */

  return { success: true };
});
