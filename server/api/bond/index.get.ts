import { eq, or } from "drizzle-orm";

export default eventHandler(async (event) : Promise<MappedLoveBond> => {
  const { user } = await requireUserSession(event);
  const DB = useDb();
  const bond = DB.select().from(tables.bonds).where(
    or(
      eq(tables.bonds.partner1, user.id),
      eq(tables.bonds.partner2, user.id)
    )
  ).get();

  if (!bond) {
    throw createError({
      statusCode: 404,
      message: "Bond not found"
    });
  }

  const partner1 = await DB.select({
    id: tables.users.id,
    name: tables.users.name,
    showAvatar: tables.users.showAvatar,
    country: tables.users.country
  }).from(tables.users).where(eq(tables.users.id, Number(bond.partner1))).get();
  
  const partner2 = await DB.select({
    id: tables.users.id,
    name: tables.users.name,
    showAvatar: tables.users.showAvatar,
    country: tables.users.country
  }).from(tables.users).where(eq(tables.users.id, Number(bond.partner2))).get();


  return {
    ...bond,
    partner1,
    partner2
  };
});
