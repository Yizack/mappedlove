import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const webhook = await readBody(event) as PayPalWebhookEvent;
  const headers = getHeaders(event);
  console.info(webhook);
  if (!headers) return;

  const isValidWebhook = await isValidPayPalWebhook(event, headers, webhook);
  console.info(isValidWebhook);
  if (!isValidWebhook) return;

  const DB = useDb();
  const today = Date.now();

  if (webhook.event_type === PayPalWebhook.PAYMENT_SALE_COMPLETED) {
    if (webhook.resource.state !== "completed" || !webhook.resource.custom || !webhook.resource.billing_agreement_id) return;
    const subscription = await getPayPalSubscription(event, webhook.resource.billing_agreement_id);
    if (!subscription) return;
    if (subscription.status !== "ACTIVE") return;

    await DB.update(tables.bonds).set({
      premium: 1,
      subscriptionId: subscription.id,
      nextPayment: new Date(subscription.billing_info.next_billing_time).getTime(),
      updatedAt: today
    }).where(and(eq(tables.bonds.id, Number(webhook.resource.custom)))).run();
  }
});
