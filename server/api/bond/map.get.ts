import { eq, asc } from "drizzle-orm";

export default eventHandler(async (event) : Promise<MappedLoveMap> => {
  const { user } = await requireUserSession(event);
  const DB = useDb();
  const markers = await DB.select().from(tables.markers).where(eq(tables.markers.bond, user.bond.id)).orderBy(asc(tables.markers.order)).all();
  const stories = await DB.select().from(tables.stories).where(eq(tables.stories.bond, user.bond.id)).all();

  return { markers, stories };
});
