export default defineEventHandler(async (event): Promise<MappedLoveBond> => {
  const { user } = await requireUserSession(event);
  const DB = useDB();
  const bond = await DB.select().from(tables.bonds).where(
    or(
      eq(tables.bonds.partner1, user.id),
      eq(tables.bonds.partner2, user.id)
    )
  ).get();

  if (!bond) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "bond_not_found" });

  if (bond.premium) {
    const today = Date.now();
    if (!bond.nextPayment || getGracePeriod(bond.nextPayment, 1) < today) {
      await DB.update(tables.bonds).set({
        premium: 0,
        nextPayment: null,
        subscriptionId: null,
        updatedAt: today
      }).where(eq(tables.bonds.id, bond.id)).run();

      bond.premium = 0;
      bond.subscriptionId = null;
      bond.updatedAt = today;
    }
  }

  return {
    ...bond,
    nextPayment: bond?.nextPayment || null,
    subscriptionId: bond?.subscriptionId || undefined,
    partners: await getPartners(event, DB, bond)
  };
});
