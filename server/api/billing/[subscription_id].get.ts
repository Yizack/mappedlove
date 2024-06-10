export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { subscription_id } = getRouterParams(event);
  const subscription = await getPaddleSubscription(event, subscription_id);
  const transactions = await getPaddleTransactions(event, subscription_id);
  const isManageable = (subscription?.custom_data as Record<string, unknown>)?.userId === user.id;

  const output = {
    subscription: subscription ? {
      id: subscription.id,
      status: subscription.status,
      current_billing_period: subscription.current_billing_period,
      management_urls: isManageable ? subscription.management_urls : null,
      scheduled_change: subscription.scheduled_change,
      is_manageable: isManageable,
    } : null,
    transactions: transactions ? transactions.map((transaction) => ({
      id: isManageable ? transaction.id : null,
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
      checkout: isManageable ? transaction.checkout : null
    })) : []
  };
  return output;
});
