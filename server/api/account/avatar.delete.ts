

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  if (!user) throw createError({ statusCode: ErrorCode.FORBIDDEN, message: "forbidden" });

  try {
    await deleteImage(`avatars/${user.id}`, event);
    return user;
  }
  catch (e) {
    console.warn(e);
    throw createError({ statusCode: ErrorCode.INTERNAL_SERVER_ERROR, message: "error" });
  }
});
