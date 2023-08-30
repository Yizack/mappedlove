import { eq, asc, desc } from "drizzle-orm";

export default eventHandler(async (event) : Promise<MappedLovePublicMap> => {
  const { code } = getRouterParams(event);

  const DB = useDb();
  const bond = await DB.select().from(tables.bonds).where(eq(tables.bonds.code, code)).get();

  if (!bond) throw createError({ statusCode: 404, statusMessage: "Bond not found" });

  const markers = await DB.select().from(tables.markers).where(eq(tables.markers.bond, bond.id)).orderBy(asc(tables.markers.order)).all();
  const stories = await DB.select().from(tables.stories).where(eq(tables.stories.bond, bond.id)).orderBy(desc(tables.stories.year), desc(tables.stories.month)).all();
  return { ...bond, markers, stories };
});
