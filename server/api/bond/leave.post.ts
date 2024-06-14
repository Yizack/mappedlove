import { eq } from "drizzle-orm";

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (!user.bond) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "bond_not_found" });

  const partnerNumber = (user.bond.partner1 as MappedLovePartner).id === user.id ? 1 : 2;

  if (partnerNumber === 1 && user.bond.subscriptionId) {
    const subscription = await getPaddleSubscription(event, user.bond.subscriptionId);
    if (!subscription) throw createError({ statusCode: ErrorCode.INTERNAL_SERVER_ERROR, message: "error" });
    if (subscription.status === "active") throw createError({ statusCode: ErrorCode.FORBIDDEN, message: "premium_owner_leaving" });
  }

  const DB = useDb();
  const bond = await DB.update(tables.bonds).set({
    [`partner${partnerNumber}`]: null,
    public: 0,
    updatedAt: Date.now()
  }).where(eq(tables.bonds.id, user.bond.id)).returning().get();

  if (!bond) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "bond_not_found" });

  await setUserSession(event, { user: { ...user, bond: undefined } });
  return { success: true };
});
