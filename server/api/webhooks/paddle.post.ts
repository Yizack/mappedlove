import type { IEventsResponse, ITransactionNotificationResponse } from "@paddle/paddle-node-sdk";

export default defineEventHandler(async (event) => {
  const webhook = await readBody<IEventsResponse<ITransactionNotificationResponse>>(event);

  const isValidWebhook = await isValidPaddleWebhook(event);
  if (!isValidWebhook) throw createError({ status: ErrorCode.BAD_REQUEST, message: "invalid_webhook" });

  if (webhook.event_type !== "transaction.completed")
    throw createError({ status: ErrorCode.BAD_REQUEST, message: "invalid_event_type" });
  if (webhook.data.status !== "completed" || !webhook.data.custom_data || !webhook.data.subscription_id)
    throw createError({ status: ErrorCode.BAD_REQUEST, message: "invalid_webhook_data" });

  const config = useRuntimeConfig(event);
  const paddle = new Paddle(config.paddle.secret);
  const subscription = await paddle.getPaddleSubscription(webhook.data.subscription_id);
  if (!subscription)
    throw createError({ status: ErrorCode.NOT_FOUND, message: "subscription_not_found" });
  if (subscription.data.status !== "active" && subscription.data.status !== "trialing")
    throw createError({ status: ErrorCode.BAD_REQUEST, message: "invalid_subscription_status" });
  if (!subscription.data.current_billing_period)
    throw createError({ status: ErrorCode.BAD_REQUEST, message: "invalid_subscription_period" });

  const customData = webhook.data.custom_data as { bondId: number, bondCode: string };

  const today = Date.now();

  await db.update(tables.bonds).set({
    premium: true,
    subscriptionId: subscription.data.id,
    nextPayment: new Date(subscription.data.current_billing_period.ends_at).getTime(),
    updatedAt: today
  }).where(and(eq(tables.bonds.code, customData.bondCode), eq(tables.bonds.id, customData.bondId))).run();

  return { success: isValidWebhook };
});
