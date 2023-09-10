import { eq, and } from "drizzle-orm";

export default eventHandler(async (event) : Promise<MappedLoveStory | undefined> => {
  const { user } = await requireUserSession(event);
  if (!user.bond) throw createError({ statusCode: 400, message: "bad_request" });
  const { id } = getRouterParams(event);
  try {
    await deleteImage(`stories/${user.bond.code}-${id}`, event);
    await deleteCloudinary(`stories/${user.bond.code}-${id}`, event);
  }
  catch (e) {
    console.warn(e);
  }
  const DB = useDb();
  return DB.delete(tables.stories).where(and(eq(tables.stories.id, Number(id)), eq(tables.stories.bond, user.bond.id))).returning().get();
});
