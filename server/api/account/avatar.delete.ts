export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  if (!user) throw createError({ statusCode: ErrorCode.FORBIDDEN, message: "forbidden" });

  try {
    await deleteImage(`avatars/${user.hash}`);
    const DB = useDB();
    const update = await DB.update(tables.users).set({
      showAvatar: 0,
      updatedAt: Date.now()
    }).where(eq(tables.users.id, user.id)).returning({
      showAvatar: tables.users.showAvatar,
      updatedAt: tables.users.updatedAt
    }).get();

    if (!update) throw createError({ statusCode: ErrorCode.INTERNAL_SERVER_ERROR, message: "error" });

    const session = { user: { ...user, ...update } };
    await setUserSession(event, session);
    return session.user;
  }
  catch (e) {
    console.warn(e);
    throw createError({ statusCode: ErrorCode.INTERNAL_SERVER_ERROR, message: "error" });
  }
});
