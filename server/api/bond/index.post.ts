import { eq, or } from "drizzle-orm";

export default eventHandler(async (event) : Promise<MappedLoveBond> => {
  const { user } = await requireUserSession(event);
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

  const today = Date.now();
  const bond = await DB.insert(tables.bonds).values({
    partner1: user.id,
    code: bondCode(user.id),
    createdAt: today,
    updatedAt: today
  }).returning().get();

  await setUserSession(event, { user: { ...user, bond } });
  return bond;
});
