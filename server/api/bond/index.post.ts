export default defineEventHandler(async (event): Promise<MappedLoveBond> => {
  const session = await requireUserSession(event);
  const DB = useDB();
  const bondExists = await DB.select().from(tables.bonds).where(
    or(
      eq(tables.bonds.partner1, session.user.id),
      eq(tables.bonds.partner2, session.user.id)
    )
  ).get();

  if (bondExists) throw createError({ statusCode: ErrorCode.CONFLICT, message: "bond_exists" });

  const today = Date.now();
  const bond = await DB.insert(tables.bonds).values({
    partner1: session.user.id,
    code: createBondCode(session.user.id),
    createdAt: today,
    updatedAt: today
  }).returning().get();

  session.user = { ...session.user, bond };
  await setUserSessionNullish(event, session);
  return bond;
});
