export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { subscription_id } = await getValidatedRouterParams(event, z.object({
    subscription_id: z.string()
  }).parse);

  const subscription = await getPaddleSubscription(event, subscription_id);
  const transactions = await getPaddleTransactions(event, subscription_id);
  const adjustments = await getPaddleAdjustments(event, subscription_id);
  const isManageable = (subscription?.custom_data as Record<string, unknown>)?.userId === user.id;

  return {
    subscription: subscription ? {
      id: subscription.id,
      status: subscription.status,
      current_billing_period: subscription.current_billing_period,
      management_urls: isManageable ? subscription.management_urls : null,
      scheduled_change: subscription.scheduled_change,
      is_manageable: isManageable
    } : null,
    transactions: transactions ? transactions.map(transaction => ({
      id: isManageable ? transaction.id : null,
      invoice_number: transaction.invoice_number,
      status: transaction.status,
      billed_at: transaction.billed_at,
      created_at: transaction.created_at,
      origin: transaction.origin,
      details: {
        totals: {
          total: transaction.details?.totals?.total,
          currency_code: transaction.details?.totals?.currency_code
        }
      },
      checkout: isManageable ? transaction.checkout : null
    })) : [],
    adjustments: adjustments ? adjustments.map(adjustment => ({
      reason: adjustment.reason,
      invoice_number: transactions?.find(transaction => transaction.id === adjustment.transaction_id)?.invoice_number,
      created_at: adjustment.created_at,
      status: adjustment.status,
      totals: {
        total: adjustment.totals?.total,
        currency_code: adjustment.totals?.currency_code
      }
    })) : []
  };
});
