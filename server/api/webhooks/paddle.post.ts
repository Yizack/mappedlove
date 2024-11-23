import type { IEventsResponse, ITransactionNotificationResponse } from "@paddle/paddle-node-sdk";

export default defineEventHandler(async (event) => {
  const webhook = await readBody<IEventsResponse<ITransactionNotificationResponse>>(event);
  const headers = getHeaders(event);

  if (!headers) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "invalid_headers" });
  const isValidWebhook = await isValidPaddleWebhook(event);

  if (!isValidWebhook) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "invalid_webhook" });

  if (webhook.event_type !== "transaction.completed")
    throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "invalid_event_type" });
  if (webhook.data.status !== "completed" || !webhook.data.custom_data || !webhook.data.subscription_id)
    throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "invalid_webhook_data" });

  const subscription = await getPaddleSubscription(event, webhook.data.subscription_id);
  if (!subscription)
    throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "subscription_not_found" });
  if (subscription.status !== "active" && subscription.status !== "trialing")
    throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "invalid_subscription_status" });
  if (!subscription.current_billing_period)
    throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "invalid_subscription_period" });

  const customData = webhook.data.custom_data as { bondId: number, bondCode: string };

  const DB = useDB();
  const today = Date.now();

  await DB.update(tables.bonds).set({
    premium: 1,
    subscriptionId: subscription.id,
    nextPayment: new Date(subscription.current_billing_period.ends_at).getTime(),
    updatedAt: today
  }).where(and(eq(tables.bonds.code, customData.bondCode), eq(tables.bonds.id, customData.bondId))).run();

  return { success: isValidWebhook };
});
