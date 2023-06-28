import { eq } from "drizzle-orm";

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized"
    });
  }
  const DB = useDb();
  return DB.delete(tables.bonds).where(eq(tables.bonds.partner1, user.id)).returning().get();
});
