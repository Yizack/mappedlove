import { eq, and } from "drizzle-orm";

export default eventHandler(async (event) : Promise<MappedLoveStory> => {
  const { user } = await requireUserSession(event);
  if (!user.bond) throw createError({ statusCode: 400, statusMessage: "Bad Request" });
  const { id } = getRouterParams(event);
  const story = await readBody(event);
  const DB = useDb();
  return DB.update(tables.stories).set({
    ...story,
    updatedAt: Date.now()
  }).where(and(eq(tables.stories.id, Number(id)), eq(tables.stories.bond, user.bond.id))).returning().get();
});
