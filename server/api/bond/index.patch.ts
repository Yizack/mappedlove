import { eq, and, or } from "drizzle-orm";

export default eventHandler(async (event) : Promise<MappedLoveBond> => {
  const { user } = await requireUserSession(event);

  if (!user.bond) throw createError({ statusCode: 404, message: "bond_not_found" });

  const body = await readBody(event);

  const DB = useDb();
  const bond = await DB.update(tables.bonds).set({
    id: user.bond.id,
    code: body.code,
    partner1: body.partner1,
    partner2: body.partner2,
    coupleDate: body.coupleDate,
    bonded: body.bonded,
    public: body.public,
    updatedAt: Date.now()
  }).where(and(eq(tables.bonds.code, user.bond.code), or(eq(tables.bonds.partner1, user.id), eq(tables.bonds.partner2, user.id)))).returning().get();
  await setUserSession(event, { user: { ...user, bond } });
  return bond;
});
