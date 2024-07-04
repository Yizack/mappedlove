import { migrate } from "drizzle-orm/d1/migrator";

export default defineNitroPlugin(async () => {
  if (!import.meta.dev) return;
  onHubReady(async () => {
    await migrate(useDB(), { migrationsFolder: "server/database/migrations" })
      .then(() => {
        console.info("Database migrations done");
      })
      .catch((err) => {
        console.warn("Database migrations failed", err);
      });
  });
});
