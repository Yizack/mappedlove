import { eq, or } from "drizzle-orm";

export default eventHandler(async (event): Promise<MappedLoveSession> => {
  const session = await requireUserSession(event);
  const { user } = session;

  if (user.bond?.bonded) return session;
  const DB = useDb();
  const bond = await DB.select().from(tables.bonds).where(
    or(
      eq(tables.bonds.partner1, user.id),
      eq(tables.bonds.partner2, user.id)
    )
  ).get();

  return setUserSession(event, { user: { ...user, bond } });
});
