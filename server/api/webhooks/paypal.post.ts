import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const webhook = await readBody(event) as PayPalWebhookEvent;
  const headers = getHeaders(event);

  if (!headers) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "invalid_headers" });
  const isValidWebhook = await isValidPayPalWebhook(event, headers, webhook);
  if (!isValidWebhook) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "invalid_webhook" });

  const DB = useDb();
  const today = Date.now();

  if (webhook.event_type !== PayPalWebhook.PAYMENT_SALE_COMPLETED)
    throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "invalid_event_type" });
  if (webhook.resource.state !== "completed" || !webhook.resource.custom || !webhook.resource.billing_agreement_id)
    throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "invalid_webhook_data" });

  const subscription = await getPayPalSubscription(event, webhook.resource.billing_agreement_id);
  if (!subscription)
    throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "Invalid subscription" });
  if (subscription.status !== "ACTIVE")
    throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "Invalid subscription status" });

  await DB.update(tables.bonds).set({
    premium: 1,
    subscriptionId: subscription.id,
    nextPayment: new Date(subscription.billing_info.next_billing_time).getTime(),
    updatedAt: today
  }).where(and(eq(tables.bonds.id, Number(webhook.resource.custom)))).run();

  return { success: isValidWebhook };
});
