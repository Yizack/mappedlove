export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);

  if (session.user.bond && session.user.bond.bonded) {
    throw createError({
      statusCode: ErrorCode.FORBIDDEN,
      message: "cant_delete_bonded_bond"
    });
  }

  const DB = useDB();
  session.user = { ...session.user, bond: null };
  await setUserSessionNullish(event, session);
  return DB.delete(tables.bonds).where(eq(tables.bonds.partner1, session.user.id)).returning().get();
});
