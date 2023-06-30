import { sql } from "drizzle-orm";

export default eventHandler(async () => {
  const DB = useDb();

  const groups = ["places", "restaurants", "hotels", "events", "activities", "cities", "others"];
  const map = groups.map((group, index) => ({ id:index, name: group }));
  return await DB.insert(tables.groups).values(map).onConflictDoUpdate({
    target: tables.groups.id,
    set: {
      name: sql`excluded.name`
    }
  }).returning().all();
});
