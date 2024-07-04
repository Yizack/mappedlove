export default defineEventHandler(async (event): Promise<MappedLoveStory> => {
  const { user } = await requireUserSession(event);

  const body = await readMultipartFormData(event);
  const file = getFileFromUpload(body);

  if (!body || !user.bond) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "bad_request" });

  const DB = useDb();
  const today = Date.now();

  const { id } = await getValidatedRouterParams(event, z.object({
    id: z.number({ coerce: true })
  }).parse);

  const form: { [key: string]: string } = {};

  for (const { name, data } of body) {
    if (!name || name === "file") continue;
    form[name] = data.toString();
  }

  const story = await DB.update(tables.stories).set({
    description: form.description || null,
    year: Number(form.year),
    month: Number(form.month),
    updatedAt: today
  }).where(and(eq(tables.stories.id, id), eq(tables.stories.bond, user.bond.id))).returning().get();

  if (!story) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "story_not_found" });

  const { secure } = useRuntimeConfig(event);
  const storyHash = hash([story.id, user.bond.code].join(), secure.salt);
  const storyPatch = { ...story, hash: storyHash };

  if (!file) return storyPatch;

  const fileSizeMaxMB = user.bond?.premium ? Quota.PREMIUM_IMAGE_FILESIZE : Quota.FREE_IMAGE_FILESIZE;
  if (!isValidFileSize(file.data.byteLength, fileSizeMaxMB)) {
    if (!user.bond?.premium) throw createError({ statusCode: ErrorCode.PAYMENT_REQUIRED, message: "check_file_size_free" });
    throw createError({ statusCode: ErrorCode.PAYMENT_REQUIRED, message: "check_file_size" });
  }

  const uploaded = await uploadImage(file, storyHash, `stories/${user.bond.id}`, event);

  if (!uploaded) {
    throw createError({ statusCode: ErrorCode.INTERNAL_SERVER_ERROR, message: "error_any" });
  }

  await uploadToCloudinary(file, storyHash, `stories/${user.bond.id}`, event);

  return storyPatch;
});
