export default eventHandler(async (event) => {
  if (!import.meta.dev) throw createError({
    statusCode: ErrorCode.NOT_FOUND,
    message: "Not found"
  });
  const { pathname } = getRouterParams(event);
  return hubBlob().serve(event, "uploads/" + pathname);
});
