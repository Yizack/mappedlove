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
  const bondExists = await DB.select().from(tables.bonds).where(
    or(
      eq(tables.bonds.partner1, user.id),
      eq(tables.bonds.partner2, user.id)
    )
  ).get();

  if (bondExists) {
    throw createError({
      statusCode: 409,
      statusMessage: "Conflict"
    });
  }

  return DB.insert(tables.bonds).values({
    partner1: user.id,
    code: bondCode(user.id)
  }).returning().get();
});
