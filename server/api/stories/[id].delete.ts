export default defineEventHandler(async (event): Promise<MappedLoveStory | undefined> => {
  const { user } = await requireUserSession(event);
  if (!user.bond) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "bond_not_found" });
  const { id } = await getValidatedRouterParams(event, z.object({
    id: z.number({ coerce: true })
  }).parse);

  const { secure } = useRuntimeConfig(event);
  const storyHash = hash([id, user.bond.code].join(), secure.salt);

  event.waitUntil(
    deleteImage([`stories/${storyHash}`, `thumbnails/${storyHash}`])
  );

  const DB = useDB();
  return DB.delete(tables.stories).where(and(eq(tables.stories.id, id), eq(tables.stories.bond, user.bond.id))).returning().get();
});
