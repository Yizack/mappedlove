export default eventHandler(async (event) : Promise<MappedLoveStory> => {
  const { user } = await requireUserSession(event);

  const body = await readMultipartFormData(event);
  const file = getFileFromUpload(body);

  if (!body || !file || !user.bond) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "bad_request" });

  const DB = useDb();
  const today = Date.now();

  const form : { [key: string]: string } = {};

  for (const { name, data } of body) {
    if (!name || name === "file") continue;
    form[name] = data.toString();
  }

  const story = await DB.insert(tables.stories).values({
    marker: Number(form.marker),
    bond: user.bond.id,
    user: user.id,
    description: form.description,
    year: Number(form.year),
    month: Number(form.month),
    createdAt: today,
    updatedAt: today
  }).returning().get();

  const { secure } = useRuntimeConfig(event);
  const storyHash = hash([story.id, user.bond.code].join(), secure.salt);
  const fileSizeMaxMB = user.bond?.premium ? Quota.PREMIUM_IMAGE_FILESIZE : Quota.FREE_IMAGE_FILESIZE;
  const uploaded = await uploadImage(file, storyHash, `stories/${user.bond.id}`, fileSizeMaxMB, event);

  if (!uploaded) {
    if (!user.bond?.premium) throw createError({ statusCode: ErrorCode.PAYMENT_REQUIRED, message: "check_file_size_free" });
    throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "check_file_size" });
  }

  await uploadToCloudinary(file, storyHash, `stories/${user.bond.id}`, event);

  return {
    ...story,
    hash: storyHash
  };
});
