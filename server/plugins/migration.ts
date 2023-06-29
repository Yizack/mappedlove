import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";

export default defineNitroPlugin(() => {
  if (process.dev) {
    try {
      migrate(useDb() as BetterSQLite3Database, { migrationsFolder: "./server/db/migrations" });
    }
    catch (err) {
      console.info("Cannot migrate database", err);
    }
  }
});
