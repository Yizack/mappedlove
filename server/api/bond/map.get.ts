export default defineEventHandler(async (event): Promise<MappedLoveMap> => {
  const { user } = await requireUserSession(event);
  if (!user.bond) throw createError({ status: ErrorCode.NOT_FOUND, message: "bond_not_found" });

  const [markers, stories] = await Promise.all([
    db.select().from(tables.markers).where(eq(tables.markers.bond, user.bond.id)).orderBy(tables.markers.order).all(),
    db.select().from(tables.stories).where(eq(tables.stories.bond, user.bond.id)).orderBy(desc(tables.stories.year), desc(tables.stories.month)).all()
  ]);

  const { secure } = useRuntimeConfig(event);
  const storiesHashed = stories.map(story => ({
    ...story,
    hash: hash([story.id, user.bond?.code].join(), secure.salt)
  }));

  return { markers, stories: storiesHashed };
});
