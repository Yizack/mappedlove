import { eq } from "drizzle-orm";

export default eventHandler(async (event) : Promise<MappedLoveBond | undefined> => {
  const { user } = await requireUserSession(event);

  const DB = useDb();
  await setUserSession(event, { user: { ...user, bond: undefined } });
  return DB.delete(tables.bonds).where(eq(tables.bonds.partner1, user.id)).returning().get();
});
