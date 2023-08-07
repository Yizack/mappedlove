export default eventHandler(async (event) : Promise<MappedLoveStory> => {
  const { user } = await requireUserSession(event);
  const body = await readMultipartFormData(event);
  const DB = useDb();
  const today = Date.now();
  if (!body) throw createError({ statusCode: 400, statusMessage: "Bad Request" });

  const form : { [key: string]: string } = {};

  for (const { name, data } of body) {
    if (!name || name === "file") continue;
    form[name] = data.toString();
  }

  if (!user.bond) throw createError({ statusCode: 400, statusMessage: "Bad Request" });

  const insert = await DB.insert(tables.stories).values({
    marker: Number(form.marker),
    bond: user.bond.id,
    description: form.description,
    year: Number(form.year),
    month: Number(form.month),
    image: 1,
    createdAt: today,
    updatedAt: today
  }).returning().get();

  const filename = `${user.bond.code}-${insert.id}`;
  await uploadImage(event, body, filename);
  return insert;
});
