export default defineEventHandler(async (event): Promise<MappedLoveBond> => {
  const { user } = await requireUserSession(event);

  const bond = await db.select().from(tables.bonds).where(
    or(
      eq(tables.bonds.partner1, user.id),
      eq(tables.bonds.partner2, user.id)
    )
  ).get();

  if (!bond) throw createError({ status: ErrorCode.NOT_FOUND, message: "bond_not_found" });

  if (bond.premium) {
    const today = Date.now();
    if (!bond.nextPayment || getGracePeriod(bond.nextPayment, 1) < today) {
      await db.update(tables.bonds).set({
        premium: false,
        nextPayment: null,
        subscriptionId: null,
        updatedAt: today
      }).where(eq(tables.bonds.id, bond.id)).run();

      bond.premium = false;
      bond.subscriptionId = null;
      bond.updatedAt = today;
    }
  }

  return {
    ...bond,
    nextPayment: bond?.nextPayment || null,
    subscriptionId: bond?.subscriptionId || undefined,
    partners: await getPartners(event, bond)
  };
});
