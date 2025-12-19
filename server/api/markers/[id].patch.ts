export default defineEventHandler(async (event): Promise<MappedLoveMarker> => {
  const { user } = await requireUserSession(event);
  if (!user.bond) throw createError({ status: ErrorCode.NOT_FOUND, message: "bond_not_found" });
  const params = await getValidatedRouterParams(event, z.object({
    id: z.coerce.number()
  }).parse);

  const validation = await readValidatedBody(event, z.object({
    lat: z.number(),
    lng: z.number()
  }).safeParse);

  if (!validation.success) throw createError({ status: ErrorCode.BAD_REQUEST, message: "invalid_marker_data" });

  const body = validation.data;

  return db.update(tables.markers).set({
    lat: body.lat,
    lng: body.lng,
    bond: user.bond.id,
    updatedAt: Date.now()
  }).where(and(eq(tables.markers.id, params.id), eq(tables.markers.bond, user.bond.id))).returning().get();
});
