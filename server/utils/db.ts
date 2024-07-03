import type { DrizzleD1Database } from "drizzle-orm/d1";
import { drizzle as drizzleD1 } from "drizzle-orm/d1";
import { drizzle } from "drizzle-orm/better-sqlite3";

// @ts-expect-error - no types
import Database from "better-sqlite3";

export { sql, eq, and, or, desc, count } from "drizzle-orm";
export * as tables from "../database/schema";

let _db: DrizzleD1Database;

export const useDb = () => {
  if (_db) return _db;

  if (process.env.DB) {
    // d1 in production
    _db = drizzleD1(process.env.DB);
    return _db;
  }
  else if (import.meta.dev) {
    // local sqlite in development
    const sqlite = new Database("server/database/db.sqlite");
    _db = drizzle(sqlite) as unknown as DrizzleD1Database;
    return _db;
  }

  throw createError({
    statusCode: ErrorCode.INTERNAL_SERVER_ERROR,
    message: "No database configured for production"
  });
};
