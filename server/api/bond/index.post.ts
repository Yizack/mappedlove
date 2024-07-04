export default defineEventHandler(async (event): Promise<MappedLoveBond> => {
  const { user } = await requireUserSession(event);
  const DB = useDB();
  const bondExists = await DB.select().from(tables.bonds).where(
    or(
      eq(tables.bonds.partner1, user.id),
      eq(tables.bonds.partner2, user.id)
    )
  ).get();

  if (bondExists) throw createError({ statusCode: ErrorCode.CONFLICT, message: "bond_exists" });

  const today = Date.now();
  const bond = await DB.insert(tables.bonds).values({
    partner1: user.id,
    code: createBondCode(user.id),
    createdAt: today,
    updatedAt: today
  }).returning().get();

  await setUserSession(event, { user: { ...user, bond } });
  return bond;
});
