export default defineEventHandler(async (event): Promise<MappedLoveMarker> => {
  const { user } = await requireUserSession(event);
  if (!user.bond) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "bond_not_found" });
  const params = await getValidatedRouterParams(event, z.object({
    id: z.coerce.number()
  }).parse);

  const validation = await readValidatedBody(event, z.object({
    lat: z.number(),
    lng: z.number(),
    group: z.number(),
    title: z.string(),
    description: z.string(),
    country: z.string().nullable().optional().transform(c => c?.toUpperCase()),
    order: z.number()
  }).safeParse);

  if (!validation.success) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "invalid_marker_data" });

  const body = validation.data;

  return db.update(tables.markers).set({
    lat: body.lat,
    lng: body.lng,
    group: body.group,
    bond: user.bond.id,
    title: body.title,
    description: body.description,
    order: body.order,
    country: body.country,
    updatedAt: Date.now()
  }).where(and(eq(tables.markers.id, params.id), eq(tables.markers.bond, user.bond.id))).returning().get();
});
