export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const params = await getValidatedRouterParams(event, z.object({
    id: z.string().startsWith("sub_")
  }).parse);

  const config = useRuntimeConfig(event);
  const paddle = new Paddle(config.paddle.secret);
  const subscription = await paddle.getPaddleSubscription(params.id);
  const transactions = await paddle.getPaddleTransactions(params.id);
  const adjustments = await paddle.getPaddleAdjustments(params.id);
  const isManageable = (subscription?.data.custom_data as { userId: number })?.userId === user.id;

  return {
    subscription: subscription ? {
      id: subscription.data.id,
      status: subscription.data.status,
      current_billing_period: subscription.data.current_billing_period,
      management_urls: isManageable ? subscription.data.management_urls : null,
      scheduled_change: subscription.data.scheduled_change,
      is_manageable: isManageable
    } : null,
    transactions: {
      ...transactions,
      data: transactions?.data.map(transaction => ({
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
      })) || []
    },
    adjustments: {
      ...adjustments,
      data: adjustments?.data.map(adjustment => ({
        reason: adjustment.reason,
        invoice_number: transactions?.data.find(transaction => transaction.id === adjustment.transaction_id)?.invoice_number,
        created_at: adjustment.created_at,
        status: adjustment.status,
        totals: {
          total: adjustment.totals?.total,
          currency_code: adjustment.totals?.currency_code
        }
      })) || []
    }
  };
});
