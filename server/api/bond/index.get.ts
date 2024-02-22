import { eq, or } from "drizzle-orm";

export default eventHandler(async (event) : Promise<MappedLoveBond> => {
  const { user } = await requireUserSession(event);
  const DB = useDb();
  const bond = await DB.select().from(tables.bonds).where(
    or(
      eq(tables.bonds.partner1, user.id),
      eq(tables.bonds.partner2, user.id)
    )
  ).get();

  if (!bond) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "bond_not_found" });

  const partner1 = await DB.select({
    id: tables.users.id,
    name: tables.users.name,
    showAvatar: tables.users.showAvatar,
    country: tables.users.country,
    updatedAt: tables.users.updatedAt
  }).from(tables.users).where(eq(tables.users.id, Number(bond.partner1))).get();

  if (!partner1) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "bond_not_found" });

  const partner2 = await DB.select({
    id: tables.users.id,
    name: tables.users.name,
    showAvatar: tables.users.showAvatar,
    country: tables.users.country,
    updatedAt: tables.users.updatedAt
  }).from(tables.users).where(eq(tables.users.id, Number(bond.partner2))).get();

  const { secure } = useRuntimeConfig(event);
  const partner1Hash = hash([partner1?.id].join(), secure.salt);

  if (bond.premium) {
    const today = Date.now();
    if (!bond.nextPayment || bond.nextPayment < today) {
      await DB.update(tables.bonds).set({
        premium: 0,
        nextPayment: null,
        subscriptionId: null,
        updatedAt: today
      }).where(eq(tables.bonds.id, bond.id)).run();
      bond.premium = 0;
      bond.nextPayment = null;
    }
  }

  await setUserSession(event, { user: { ...user, bond } });

  return {
    ...bond,
    nextPayment: bond.nextPayment || undefined,
    subscriptionId: bond.subscriptionId || undefined,
    partner1: {
      ...partner1,
      hash: partner1Hash
    },
    partner2: partner2 ? {
      ...partner2,
      hash: hash([partner2?.id].join(), secure.salt)
    } : null
  };
});
