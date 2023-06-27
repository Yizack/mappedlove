import { migrate } from "drizzle-orm/better-sqlite3/migrator";

export default defineNitroPlugin(() => {
  if (process.dev) {
    migrate(useDb(), { migrationsFolder: "./server/db/migrations" });
  }
});
