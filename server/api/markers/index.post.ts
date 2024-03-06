import { eq, desc, count } from "drizzle-orm";


export default eventHandler(async (event) : Promise<MappedLoveMarker> => {
  const { user } = await requireUserSession(event);
  if (!user.bond) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "bond_not_found" });

  const body = await readValidatedBody(event, (body) => z.object({
    lat: z.number(),
    lng: z.number(),
    group: z.number(),
    title: z.string(),
    description: z.string()
  }).safeParse(body));

  if (!body.success) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "invalid_marker_data" });

  const marker = body.data;
  const DB = useDb();

  const last = await DB.select().from(tables.markers).where(eq(tables.markers.bond, user.bond.id)).orderBy(desc(tables.markers.order)).limit(1).get();
  const today = Date.now();

  const markers = await DB.select({
    count: count(tables.markers.id)
  }).from(tables.markers).where(eq(tables.markers.bond, user.bond.id)).get();

  if (!user.bond.premium && markers && markers.count >= FreeLimits.MARKERS) throw createError({ statusCode: ErrorCode.PAYMENT_REQUIRED, message: "max_markers" });

  return DB.insert(tables.markers).values({
    lat: marker.lat,
    lng: marker.lng,
    group: marker.group,
    bond: user.bond.id,
    title: marker.title,
    description: marker.description,
    order: last ? last.order + 1 : 0,
    createdAt: today,
    updatedAt: today
  }).returning().get();
});
