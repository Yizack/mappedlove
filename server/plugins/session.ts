export default defineNitroPlugin(() => {
  sessionHooks.hook("fetch", async (session) => {
    if (!session.user) return;

    const DB = useDB();
    const bond = await DB.select().from(tables.bonds).where(
      or(
        eq(tables.bonds.partner1, session.user.id),
        eq(tables.bonds.partner2, session.user.id)
      )
    ).get();

    if (bond?.premium) {
      const today = Date.now();
      if (!bond.nextPayment || getGracePeriod(bond.nextPayment, 1) < today) {
        await DB.update(tables.bonds).set({
          premium: false,
          subscriptionId: null,
          updatedAt: today
        }).where(eq(tables.bonds.id, bond.id)).run();
        bond.premium = false;
        bond.subscriptionId = null;
      }
    }

    if (session.user.bond) {
      session.user.bond = { ...session.user.bond, ...bond };
    }
  });
});
