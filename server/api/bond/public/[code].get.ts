export default defineCachedEventHandler(async (event): Promise<MappedLovePublicMap> => {
  const { code } = await getValidatedRouterParams(event, z.object({
    code: z.string().min(5).toUpperCase()
  }).parse);

  const DB = useDB();
  const bond = await DB.select().from(tables.bonds).where(and(eq(tables.bonds.code, code), eq(tables.bonds.public, true))).get();

  if (!bond || (!bond.partner1 || !bond.partner2)) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "bond_not_found" });

  const [markers, stories] = await Promise.all([
    DB.select().from(tables.markers).where(
      eq(tables.markers.bond, bond.id)
    ).orderBy(tables.markers.order).all(),

    DB.select().from(tables.stories).where(
      eq(tables.stories.bond, bond.id)
    ).orderBy(desc(tables.stories.year), desc(tables.stories.month)).all()
  ]);

  const partners = await getPartners(event, DB, bond);

  if (!partners.length) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "bond_not_found" });

  const { secure } = useRuntimeConfig(event);

  const storiesHashed = stories.map((story) => ({
    ...story,
    hash: hash([story.id, bond.code].join(), secure.salt)
  }));

  return {
    ...bond,
    partners: partners,
    markers,
    stories: storiesHashed
  };
}, {
  swr: false,
  group: "api",
  name: "public-map",
  getKey: event => event.path,
  maxAge: 60 * 5,
  shouldBypassCache: () => !!import.meta.dev
}); // Cache public map for 5 minutes
