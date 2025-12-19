export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  if (!user.bond) throw createError({ status: ErrorCode.NOT_FOUND, message: "bond_not_found" });
  const params = await getValidatedRouterParams(event, z.object({
    id: z.coerce.number()
  }).parse);

  const { secure } = useRuntimeConfig(event);
  const storyHash = hash([params.id, user.bond.code].join(), secure.salt);

  event.waitUntil(Promise.allSettled([
    deleteImage([`stories/${storyHash}`, `thumbnails/${storyHash}`]),
    db.delete(tables.stories).where(and(eq(tables.stories.id, params.id), eq(tables.stories.bond, user.bond.id))).run()
  ]));
});
