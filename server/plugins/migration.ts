import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { seedDev } from "../utils/seed";

export default defineNitroPlugin(() => {
  if (import.meta.dev) {
    try {
      const DB = useDb() as unknown as BetterSQLite3Database;
      migrate(DB, { migrationsFolder: "./server/database/migrations" });
      seedDev();
    }
    catch (err) {
      console.info("Cannot migrate database", err);
    }
  }
});
