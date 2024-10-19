export default defineEventHandler(async (event): Promise<MappedLoveStory> => {
  const { user } = await requireUserSession(event);

  const body = await readMultipartFormData(event);
  const formData = await readFormData(event);
  const file = formData.get("file") as File;

  if (!body || !file || !user.bond) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "bad_request" });

  ensureBlob(file, {
    types: ["image/jpeg", "image/png", "image/gif", "image/webp"]
  });

  const fileSizeMaxMB = user.bond?.premium ? Quota.PREMIUM_IMAGE_FILESIZE : Quota.FREE_IMAGE_FILESIZE;
  if (!isValidFileSize(file, fileSizeMaxMB)) {
    if (!user.bond?.premium) throw createError({ statusCode: ErrorCode.PAYMENT_REQUIRED, message: "check_file_size_free" });
    throw createError({ statusCode: ErrorCode.PAYMENT_REQUIRED, message: "check_file_size" });
  }

  const DB = useDB();
  const today = Date.now();

  const form: { [key: string]: string } = {};

  for (const { name, data } of body) {
    if (!name || name === "file") continue;
    form[name] = data.toString();
  }

  const story = await DB.insert(tables.stories).values({
    marker: Number(form.marker),
    bond: user.bond.id,
    user: user.id,
    description: form.description || null,
    year: Number(form.year),
    month: Number(form.month),
    createdAt: today,
    updatedAt: today
  }).returning().get();

  const { secure } = useRuntimeConfig(event);
  const storyHash = hash([story.id, user.bond.code].join(), secure.salt);
  const uploaded = await uploadImage(file, { name: storyHash, folder: "stories",
    customMetadata: {
      bondId: user.bond.id.toString(),
      userId: user.id.toString(),
      storyId: story.id.toString()
    }
  });

  if (!uploaded) {
    await DB.delete(tables.stories).where(eq(tables.stories.id, story.id)).run();
    throw createError({ statusCode: ErrorCode.INTERNAL_SERVER_ERROR, message: "error_any" });
  }

  await uploadToCloudinary(event, file, { filename: storyHash, folder: "stories" });

  return {
    ...story,
    hash: storyHash
  };
});
