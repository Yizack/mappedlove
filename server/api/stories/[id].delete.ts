export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  if (!user.bond) throw createError({ statusCode: ErrorCode.NOT_FOUND, message: "bond_not_found" });
  const { id } = await getValidatedRouterParams(event, z.object({
    id: z.coerce.number()
  }).parse);

  const { secure } = useRuntimeConfig(event);
  const storyHash = hash([id, user.bond.code].join(), secure.salt);

  const DB = useDB();
  event.waitUntil(Promise.allSettled([
    deleteImage([`stories/${storyHash}`, `thumbnails/${storyHash}`]),
    DB.delete(tables.stories).where(and(eq(tables.stories.id, id), eq(tables.stories.bond, user.bond.id))).run()
  ]));
});
