import { eq, desc } from "drizzle-orm";

export default eventHandler(async (event) : Promise<MappedLoveMarker> => {
  const { user } = await requireUserSession(event);
  if (!user.bond) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "bond_not_found" });
  const marker = await readBody(event);
  const DB = useDb();

  const last = await DB.select().from(tables.markers).where(eq(tables.markers.bond, user.bond.id)).orderBy(desc(tables.markers.order)).limit(1).get();
  const today = Date.now();

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
