export default defineEventHandler(async (event): Promise<MappedLoveMap> => {
  const { user } = await requireUserSession(event);
  if (!user.bond) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "bond_not_found" });
  const DB = useDB();
  const markers = await DB.select().from(tables.markers).where(eq(tables.markers.bond, user.bond.id)).orderBy(tables.markers.order).all();
  const stories = await DB.select().from(tables.stories).where(eq(tables.stories.bond, user.bond.id)).orderBy(desc(tables.stories.year), desc(tables.stories.month)).all();

  const { secure } = useRuntimeConfig(event);
  const storiesHashed = stories.map((story) => {
    return {
      ...story,
      hash: hash([story.id, user.bond?.code].join(), secure.salt)
    };
  });

  return { markers, stories: storiesHashed };
});
