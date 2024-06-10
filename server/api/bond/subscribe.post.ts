import Mustache from "mustache";
import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const body = await readValidatedBody(event, (body) => z.object({
    bondId: z.number(),
    transactionId: z.string()
  }).safeParse(body));

  if (!body.success) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "invalid_payment_data" });

  const payment = body.data;

  if (payment.bondId !== user.bond?.id) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "bond_not_found" });

  const transaction = await getPaddleTransaction(event, payment.transactionId);
  if (!transaction) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "transaction_not_found" });

  const DB = useDb();
  const today = Date.now();

  const update = await DB.update(tables.bonds).set({
    premium: 1,
    nextPayment: today + 1 * 24 * 60 * 60 * 1000, // 1 day grace period
    updatedAt: today
  }).where(and(eq(tables.bonds.id, payment.bondId))).returning({
    premium: tables.bonds.premium,
    nextPayment: tables.bonds.nextPayment,
    updatedAt: tables.bonds.updatedAt
  }).get();

  if (!update) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "bond_not_found" });

  if(transaction.origin === "web") {
    const html = Mustache.render(templates.premiumWelcome, {
      lang: "en",
      domain: SITE.domain
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
  }

  await setUserSession(event, { user: { ...user, bond: { ...user.bond, ...update } }});

  return { success: true };
});
