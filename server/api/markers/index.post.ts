import { eq, desc } from "drizzle-orm";

export default eventHandler(async (event) : Promise<MappedLoveMarker> => {
  const { user } = await requireUserSession(event);
  if (!user.bond) throw createError({ statusCode: 404, message: "bond_not_found" });
  const body = await readBody(event);
  const DB = useDb();

  const last = await DB.select().from(tables.markers).where(eq(tables.markers.bond, user.bond.id)).orderBy(desc(tables.markers.order)).limit(1).get();
  const today = Date.now();

  return DB.insert(tables.markers).values({
    lat: body.lat,
    lng: body.lng,
    group: body.group,
    bond: user.bond.id,
    title: body.title,
    description: body.description,
    order: last ? last.order + 1 : 0,
    createdAt: today,
    updatedAt: today
  }).returning().get();
});
