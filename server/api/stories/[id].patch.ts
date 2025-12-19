export default defineEventHandler(async (event): Promise<MappedLoveStory> => {
  const { user } = await requireUserSession(event);

  const body = await readMultipartFormData(event);
  const formData = await readFormData(event);
  const file = formData.get("file") as File;

  if (!body || !user.bond) throw createError({ status: ErrorCode.BAD_REQUEST, message: "bad_request" });
  if (file) {
    ensureBlob(file, {
      types: ["image/jpeg", "image/png", "image/gif", "image/webp"]
    });
  }
  const today = Date.now();

  const params = await getValidatedRouterParams(event, z.object({
    id: z.coerce.number()
  }).parse);

  const form: { [key: string]: string } = {};

  for (const { name, data } of body) {
    if (!name || name === "file") continue;
    form[name] = data.toString();
  }

  const story = await db.update(tables.stories).set({
    description: form.description || null,
    year: Number(form.year),
    month: Number(form.month),
    updatedAt: today
  }).where(and(eq(tables.stories.id, params.id), eq(tables.stories.bond, user.bond.id))).returning().get();

  if (!story) throw createError({ status: ErrorCode.NOT_FOUND, message: "story_not_found" });

  const { secure } = useRuntimeConfig(event);
  const storyHash = hash([story.id, user.bond.code].join(), secure.salt);
  const storyPatch = { ...story, hash: storyHash };

  if (!file) return storyPatch;

  const fileSizeMaxMB = user.bond?.premium ? Quota.PREMIUM_IMAGE_FILESIZE : Quota.FREE_IMAGE_FILESIZE;
  if (!isValidFileSize(file, fileSizeMaxMB)) {
    if (!user.bond?.premium) throw createError({ status: ErrorCode.PAYMENT_REQUIRED, message: "check_file_size_free" });
    throw createError({ status: ErrorCode.PAYMENT_REQUIRED, message: "check_file_size" });
  }

  const uploaded = await uploadImage(file, {
    name: storyHash, folder: "stories",
    customMetadata: {
      bondId: user.bond.id.toString(),
      userId: user.id.toString(),
      storyId: story.id.toString()
    }
  });

  if (!uploaded) {
    throw createError({ status: ErrorCode.INTERNAL_SERVER_ERROR, message: "error_any" });
  }

  event.waitUntil(
    createThumbnail(event, file, {
      name: storyHash,
      metadata: {
        storyId: story.id.toString(),
        userId: user.id.toString(),
        bondId: user.bond.id.toString()
      }
    })
  );

  return storyPatch;
});
