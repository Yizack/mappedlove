// @ts-ignore
import Mustache from "mustache";
import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const payment = await readBody(event);

  if (!payment.bondId) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "bond_not_found" });
  if (!payment.transactionId) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "payment_error" });

  const transaction = await getPaddleTransaction(event, payment.transactionId);
  if (!transaction) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "transaction_not_found" });

  const DB = useDb();
  const today = Date.now();

  const update = await DB.update(tables.bonds).set({
    premium: 1,
    nextPayment: today + 1 * 24 * 60 * 60 * 1000, // 1 day grace period
    updatedAt: today
  }).where(and(eq(tables.bonds.id, payment.bondId))).returning().get();

  if (!update) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "bond_not_found" });

  const html = Mustache.render(templates.premiumWelcome, {
    // nextPayment: new Date(subscription.billing_info.next_billing_time).toLocaleDateString(),
  });

  const config = useRuntimeConfig(event);

  await sendMail(config, {
    to: {
      email: user.email,
      name: user.name
    },
    subject: "Premium subscription activated!",
    html
  });

  await setUserSession(event, { user: { ...user, bond: { ...user.bond, ...update } }});

  return { success: true };
});
