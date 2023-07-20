import { eq, asc } from "drizzle-orm";

export default eventHandler(async (event) : Promise<MappedLoveMarker[]> => {
  const { user } = await requireUserSession(event);
  const DB = useDb();
  return DB.select().from(tables.markers).orderBy(tables.markers.order).where(eq(tables.markers.bond, user.bond.id)).orderBy(asc(tables.markers.order)).all();
});
