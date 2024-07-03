export default defineEventHandler(async (event) => {
  await requireUserSession(event);
  const { transaction_id } = await getValidatedRouterParams(event, z.object({
    transaction_id: z.string()
  }).parse);

  const invoice = await getPaddleTransactionInvoice(event, transaction_id);
  if (!invoice) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "invoice_not_found" });
  return sendRedirect(event, invoice.url);
});
