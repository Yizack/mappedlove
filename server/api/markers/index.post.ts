import { eq } from "drizzle-orm";

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const body = await readBody(event);
  const DB = useDb();

  return DB.insert(tables.markers).values({
    lat: body.lat,
    lng: body.lng,
    group: body.group,
    bond: user.bond.id,
    title: body.title,
    description: body.description,
    order: body.order
  }).returning().get();
});
