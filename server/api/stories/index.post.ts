import { eq } from "drizzle-orm";

export default eventHandler(async (event) : Promise<MappedLoveStory> => {
  const { user } = await requireUserSession(event);

  const body = await readMultipartFormData(event);
  const file = getFileFromUpload(body);

  if (!body || !file || !user.bond) throw createError({ statusCode: 400, statusMessage: "Bad Request" });

  const DB = useDb();
  const today = Date.now();

  const form : { [key: string]: string } = {};

  for (const { name, data } of body) {
    if (!name || name === "file") continue;
    form[name] = data.toString();
  }

  const insert = await DB.insert(tables.stories).values({
    marker: Number(form.marker),
    bond: user.bond.id,
    description: form.description,
    year: Number(form.year),
    month: Number(form.month),
    createdAt: today,
    updatedAt: today
  }).returning().get();

  const filename = `${user.bond.code}-${insert.id}`;
  const uploaded = await uploadImage(file, filename, "stories", event);

  if (!uploaded) {
    await DB.delete(tables.stories).where(eq(tables.stories.id, insert.id)).run();
    throw createError({ statusCode: 500, statusMessage: "Internal Server Error" });
  }

  await uploadToCloudinary(file, filename, "stories", event);

  return insert;
});
