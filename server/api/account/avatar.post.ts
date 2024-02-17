import { eq } from "drizzle-orm";

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const body = await readMultipartFormData(event);
  const file = getFileFromUpload(body);

  if (!body || !file ) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "bad_request" });

  const DB = useDb();
  const today = Date.now();

  const form : { [key: string]: string } = {};

  for (const { name, data } of body) {
    if (!name || name === "file") continue;
    form[name] = data.toString();
  }

  const update = await DB.update(tables.users).set({
    showAvatar: 1,
    updatedAt: today
  }).where(eq(tables.users.id, user.id)).returning({
    showAvatar: tables.users.showAvatar,
    updatedAt: tables.users.updatedAt
  }).get();

  if (!update) throw createError({ statusCode: ErrorCode.INTERNAL_SERVER_ERROR, message: "error" });

  const filename = `${user.id}`;
  const uploaded = await uploadImage(file, filename, "avatars", event);

  if (!uploaded) throw createError({ statusCode: ErrorCode.BAD_REQUEST, message: "check_file_size" });

  const session = { user: { ...user, ...update } };
  await setUserSession(event, session);

  return session;
});
