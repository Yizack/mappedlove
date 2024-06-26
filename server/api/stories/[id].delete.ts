import { eq, and } from "drizzle-orm";

export default defineEventHandler(async (event): Promise<MappedLoveStory | undefined> => {
  const { user } = await requireUserSession(event);
  if (!user.bond) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "bond_not_found" });
  const { id } = getRouterParams(event);
  try {
    const { secure } = useRuntimeConfig(event);
    const storyHash = hash([id, user.bond.code].join(), secure.salt);
    await deleteImage(`stories/${user.bond.id}/${storyHash}`, event);
    await deleteCloudinary(`stories/${user.bond.id}/${storyHash}`, event);
  }
  catch (e) {
    console.warn(e);
  }
  const DB = useDb();
  return DB.delete(tables.stories).where(and(eq(tables.stories.id, Number(id)), eq(tables.stories.bond, user.bond.id))).returning().get();
});
