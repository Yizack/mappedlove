export default defineEventHandler(async (event) => {
  await requireUserSession(event);
  const { subscription_id } = getRouterParams(event);
  const subscription = await getPaddleSubscription(event, subscription_id);
  const transactions = await getPaddleTransactions(event, subscription_id);

  const output = {
    subscription: subscription ? {
      id: subscription.id,
      status: subscription.status,
      current_billing_period: subscription.current_billing_period,
      management_urls: subscription.management_urls,
      scheduled_change: subscription.scheduled_change,
    } : null,
    transactions: transactions?.map((transaction) => ({
      id: transaction.id,
      invoice_number: transaction.invoice_number,
      status: transaction.status,
      billed_at: transaction.billed_at,
      created_at: transaction.created_at,
      origin: transaction.origin,
      details: {
        totals:  {
          total: transaction.details?.totals?.total,
          currency_code: transaction.details?.totals?.currency_code
        }
      },
      checkout: transaction.checkout
    }))
  };
  return output;
});
