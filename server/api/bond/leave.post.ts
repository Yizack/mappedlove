import { eq } from "drizzle-orm";

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (!user.bond) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "bond_not_found" });

  const partnerNumber = (user.bond.partner1 as MappedLovePartner).id === user.id ? 1 : 2;

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
