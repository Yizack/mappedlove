export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const params = await getValidatedRouterParams(event, z.object({
    id: z.string().startsWith("sub_")
  }).parse);

  const query = await getValidatedQuery(event, z.object({
    after: z.string().optional()
  }).parse);

  const config = useRuntimeConfig(event);
  const paddle = new Paddle(config.paddle.secret);
  const transactions = await paddle.getPaddleTransactions(params.id, query.after);

  return {
    ...transactions,
    data: transactions?.data.map((transaction) => {
      const isManageable = (transaction.custom_data as { userId: number })?.userId === user.id;
      return {
        id: isManageable ? transaction.id : null,
        invoice_number: transaction.invoice_number,
        status: transaction.status,
        billed_at: transaction.billed_at,
        created_at: transaction.created_at,
        origin: transaction.origin,
        custom_data: transaction.custom_data,
        details: {
          totals: {
            total: transaction.details?.totals?.total,
            currency_code: transaction.details?.totals?.currency_code
          }
        },
        checkout: isManageable ? transaction.checkout : null
      };
    }) || []
  };
});
