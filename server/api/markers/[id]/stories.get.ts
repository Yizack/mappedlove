import { eq, and } from "drizzle-orm";

export default eventHandler(async (event) : Promise<MappedLoveStory[]> => {
  const { user } = await requireUserSession(event);
  const { id } = getRouterParams(event);
  const DB = useDb();
  const marker = await DB.select().from(tables.markers).where(and(eq(tables.markers.bond, user.bond.id), eq(tables.markers.id, Number(id)))).get();
  if (!marker) {
    throw createError({
      statusCode: 404,
      message: "Marker not found or not accessible"
    });
  }
  return DB.select().from(tables.stories).where(eq(tables.stories.marker, Number(id))).orderBy(tables.stories.date).all();
});
