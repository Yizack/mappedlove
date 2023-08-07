import { eq, asc, desc } from "drizzle-orm";

export default eventHandler(async (event) : Promise<MappedLoveMap> => {
  const { user } = await requireUserSession(event);
  if (!user.bond) throw createError({ statusCode: 400, statusMessage: "Bad Request" });
  const DB = useDb();
  const markers = await DB.select().from(tables.markers).where(eq(tables.markers.bond, user.bond.id)).orderBy(asc(tables.markers.order)).all();
  const stories = await DB.select().from(tables.stories).where(eq(tables.stories.bond, user.bond.id)).orderBy(desc(tables.stories.year), desc(tables.stories.month)).all();
  return { markers, stories };
});
