export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  if (!user.bond) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "bond_not_found" });

  const params = await getValidatedRouterParams(event, z.object({
    id: z.coerce.number()
  }).parse);

  event.waitUntil(
    db.delete(tables.markers).where(and(eq(tables.markers.id, params.id), eq(tables.markers.bond, user.bond.id))).run()
  );
});
