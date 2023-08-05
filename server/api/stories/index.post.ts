export default eventHandler(async (event) : Promise<MappedLoveStory> => {
  const { user } = await requireUserSession(event);
  const body = await readBody(event);
  const DB = useDb();

  const today = Date.now();

  return DB.insert(tables.stories).values({
    marker: body.marker,
    bond: user.bond.id,
    description: body.description,
    year: body.year,
    month: body.month,
    image: body.image,
    createdAt: today,
    updatedAt: today
  }).returning().get();
});
