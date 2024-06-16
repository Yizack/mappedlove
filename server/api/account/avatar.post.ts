import { eq } from "drizzle-orm";

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const body = await readMultipartFormData(event);
  const file = getFileFromUpload(body);

  if (!body || !file ) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "bad_request" });

  const DB = useDb();
  const today = Date.now();

  const update = await DB.update(tables.users).set({
    showAvatar: 1,
    updatedAt: today
  }).where(eq(tables.users.id, user.id)).returning({
    showAvatar: tables.users.showAvatar,
    updatedAt: tables.users.updatedAt
  }).get();

  if (!update) throw createError({ statusCode: ErrorCode.INTERNAL_SERVER_ERROR, message: "error" });

  const fileSizeMaxMB = user.bond?.premium ? Quota.PREMIUM_IMAGE_FILESIZE : Quota.FREE_IMAGE_FILESIZE;
  const filename = `${user.hash}`;
  const uploaded = await uploadImage(file, filename, `avatars/${user.id}`, fileSizeMaxMB, event);

  if (!uploaded) {
    if (!user.bond?.premium) throw createError({ statusCode: ErrorCode.PAYMENT_REQUIRED, message: "check_file_size_free" });
    throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "check_file_size" });
  }

  const session = { user: { ...user, ...update } };
  await setUserSession(event, session);

  return session.user;
});
