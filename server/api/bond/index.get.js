import { eq, or } from "drizzle-orm";

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized"
    });
  }
  const DB = useDb();
  return DB.select().from(tables.bonds).where(
    or(
      eq(tables.bonds.partner1, user.id),
      eq(tables.bonds.partner2, user.id)
    )
  ).get();
});
