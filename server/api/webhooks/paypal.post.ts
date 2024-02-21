import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const webhook = await readBody(event) as PayPalWebhookEvent<PaymentSaleCompletedEventResource>;
  const DB = useDb();

  if (webhook.event_type == "PAYMENT.SALE.COMPLETED") {
    // if (!webhook.resource.custom) return;
    console.info(webhook.resource);
  }
});
