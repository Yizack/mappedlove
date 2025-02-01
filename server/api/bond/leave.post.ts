export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);

  if (!session.user.bond) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "bond_not_found" });

  const partnerNumber = session.user.bond.partner1 === session.user.id ? 1 : 2;

  if (partnerNumber === 1 && session.user.bond.subscriptionId) {
    const subscription = await getPaddleSubscription(event, session.user.bond.subscriptionId);
    if (subscription && subscription.status === "active" && subscription.scheduled_change?.action !== "cancel") throw createError({ statusCode: ErrorCode.FORBIDDEN, message: "premium_owner_leaving" });
  }

  const DB = useDB();
  const update = await DB.update(tables.bonds).set({
    [`partner${partnerNumber}`]: null,
    public: 0,
    updatedAt: Date.now()
  }).where(eq(tables.bonds.id, session.user.bond.id)).returning().get();

  if (!update) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "bond_not_found" });

  session.user = { ...session.user, bond: null };
  await setUserSessionNullish(event, session);
  return { success: true };
});
