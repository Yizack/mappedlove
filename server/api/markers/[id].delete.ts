export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  if (!user.bond) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "bond_not_found" });

  const { id } = await getValidatedRouterParams(event, z.object({
    id: z.number({ coerce: true })
  }).parse);

  const DB = useDB();
  event.waitUntil(
    DB.delete(tables.markers).where(and(eq(tables.markers.id, id), eq(tables.markers.bond, user.bond.id))).run()
  );
});
