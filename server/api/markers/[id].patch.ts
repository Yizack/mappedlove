import { eq, and } from "drizzle-orm";

export default eventHandler(async (event) : Promise<MappedLoveMarker> => {
  const { user } = await requireUserSession(event);
  const { id } = getRouterParams(event);
  const marker = await readBody(event);
  const DB = useDb();
  return DB.update(tables.markers).set(marker).where(and(eq(tables.markers.id, Number(id)), eq(tables.markers.bond, user.bond.id))).returning().get();
});
