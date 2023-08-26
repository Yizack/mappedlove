import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { seedDev } from "~/server/utils/seed";

export default defineNitroPlugin(() => {
  if (process.dev) {
    try {
      const DB = useDb() as any as BetterSQLite3Database;
      migrate(DB, { migrationsFolder: "./server/db/migrations" });
      if (process.env.SEED) seedDev(DB);
    }
    catch (err) {
      console.info("Cannot migrate database", err);
    }
  }
});
