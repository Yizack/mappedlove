export default defineNitroPlugin(() => {
  sessionHooks.hook("fetch", async (session, event) => {
    if (!session.user) return;
    const { user } = session;

    const DB = useDB();
    const bond = await DB.select().from(tables.bonds).where(
      or(
        eq(tables.bonds.partner1, user.id),
        eq(tables.bonds.partner2, user.id)
      )
    ).get();

    if (!bond) {
      await setUserSession(event, { user: { ...user, bond: undefined } });
      return;
    }

    const partner1 = await DB.select({
      id: tables.users.id,
      name: tables.users.name,
      showAvatar: tables.users.showAvatar,
      country: tables.users.country,
      updatedAt: tables.users.updatedAt
    }).from(tables.users).where(eq(tables.users.id, Number(bond?.partner1))).get();

    const partner2 = await DB.select({
      id: tables.users.id,
      name: tables.users.name,
      showAvatar: tables.users.showAvatar,
      country: tables.users.country,
      updatedAt: tables.users.updatedAt
    }).from(tables.users).where(eq(tables.users.id, Number(bond?.partner2))).get();

    const { secure } = useRuntimeConfig(event);

    if (bond?.premium) {
      const today = Date.now();
      if (!bond.nextPayment || getGracePeriod(bond.nextPayment, 1) < today) {
        await DB.update(tables.bonds).set({
          premium: 0,
          subscriptionId: null,
          updatedAt: today
        }).where(eq(tables.bonds.id, bond.id)).run();
        bond.premium = 0;
        bond.subscriptionId = null;
      }
    }

    const userBond = {
      ...bond,
      nextPayment: bond?.nextPayment || null,
      subscriptionId: bond?.subscriptionId || undefined,
      partner1: partner1 ? {
        ...partner1,
        hash: hash([partner1?.id].join(), secure.salt)
      } : null,
      partner2: partner2 ? {
        ...partner2,
        hash: hash([partner2?.id].join(), secure.salt)
      } : null
    };

    await setUserSessionNullable(event, { user: { ...user, bond: userBond } });
  });
});
