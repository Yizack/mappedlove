export default defineEventHandler(async (event): Promise<MappedLoveBond | undefined> => {
  const { user } = await requireUserSession(event);

  if (user.bond && user.bond.bonded) {
    throw createError({
      statusCode: ErrorCode.FORBIDDEN,
      message: "cant_delete_bonded_bond"
    });
  }

  const DB = useDB();
  await setUserSessionNullable(event, { user: { ...user, bond: undefined } });
  return DB.delete(tables.bonds).where(eq(tables.bonds.partner1, user.id)).returning().get();
});
