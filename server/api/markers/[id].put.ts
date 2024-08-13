export default defineEventHandler(async (event): Promise<MappedLoveMarker> => {
  const { user } = await requireUserSession(event);
  if (!user.bond) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "bond_not_found" });
  const { id } = await getValidatedRouterParams(event, z.object({
    id: z.number({ coerce: true })
  }).parse);

  const body = await readValidatedBody(event, body => z.object({
    lat: z.number(),
    lng: z.number(),
    group: z.number(),
    title: z.string(),
    description: z.string(),
    order: z.number()
  }).safeParse(body));

  if (!body.success) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "invalid_marker_data" });

  const marker = body.data;

  const DB = useDB();
  return DB.update(tables.markers).set({
    lat: marker.lat,
    lng: marker.lng,
    group: marker.group,
    bond: user.bond.id,
    title: marker.title,
    description: marker.description,
    order: marker.order,
    updatedAt: Date.now()
  }).where(and(eq(tables.markers.id, id), eq(tables.markers.bond, user.bond.id))).returning().get();
});
