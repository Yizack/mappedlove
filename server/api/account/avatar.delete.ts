export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  if (!user) throw createError({ statusCode: ErrorCode.FORBIDDEN, message: "forbidden" });

  const DB = useDB();
  const update = await DB.update(tables.users).set({
    showAvatar: false,
    updatedAt: Date.now()
  }).where(eq(tables.users.id, user.id)).returning({
    showAvatar: tables.users.showAvatar,
    updatedAt: tables.users.updatedAt
  }).get();

  if (!update) throw createError({ statusCode: ErrorCode.INTERNAL_SERVER_ERROR, message: "error" });

  const session = { user: { ...user, ...update } };
  await setUserSessionNullish(event, session);

  event.waitUntil(
    deleteImage(`avatars/${user.hash}`)
  );

  return session.user;
});
