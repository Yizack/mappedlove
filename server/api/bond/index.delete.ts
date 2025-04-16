export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  if (user.bond && user.bond.bonded) {
    throw createError({
      statusCode: ErrorCode.FORBIDDEN,
      message: "cant_delete_bonded_bond"
    });
  }

  const session = { user: { ...user, bond: null } };
  await setUserSessionNullish(event, session);

  const DB = useDB();
  return DB.delete(tables.bonds).where(eq(tables.bonds.partner1, user.id)).returning().get();
});
