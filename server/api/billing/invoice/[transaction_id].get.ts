export default defineEventHandler(async (event) => {
  await requireUserSession(event);
  const { transaction_id } = getRouterParams(event);
  const invoice = await getPaddleTransactionInvoice(event, transaction_id!);
  if (!invoice) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "invoice_not_found" });
  return sendRedirect(event, invoice.url);
});
