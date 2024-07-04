export default defineEventHandler(async (event): Promise<MappedLoveMarker | undefined> => {
  const { user } = await requireUserSession(event);
  if (!user.bond) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "bond_not_found" });
  const { id } = await getValidatedRouterParams(event, z.object({
    id: z.number({ coerce: true })
  }).parse);

  const DB = useDB();
  return DB.delete(tables.markers).where(and(eq(tables.markers.id, id), eq(tables.markers.bond, user.bond.id))).returning().get();
});
