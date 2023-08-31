import { eq, and } from "drizzle-orm";

export default eventHandler(async (event) : Promise<MappedLoveStory> => {
  const { user } = await requireUserSession(event);

  const body = await readMultipartFormData(event);
  const file = getFileFromUpload(body);

  if (!body || !user.bond) throw createError({ statusCode: 400, statusMessage: "Bad Request" });

  const DB = useDb();
  const today = Date.now();

  const { id } = getRouterParams(event);
  const form : { [key: string]: string } = {};

  for (const { name, data } of body) {
    if (!name || name === "file") continue;
    form[name] = data.toString();
  }

  const update = await DB.update(tables.stories).set({
    description: form.description,
    year: Number(form.year),
    month: Number(form.month),
    updatedAt: today
  }).where(and(eq(tables.stories.id, Number(id)), eq(tables.stories.bond, user.bond.id))).returning().get();

  if (!file) return update;

  const filename = `${user.bond.code}-${update.id}`;
  const uploaded = await uploadImage(event, file, filename);

  if (!uploaded) {
    throw createError({ statusCode: 500, statusMessage: "Internal Server Error" });
  }

  uploadToCloudinary(filename, event);

  return update;
});
