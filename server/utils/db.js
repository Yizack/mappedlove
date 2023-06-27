import { drizzle as drizzleD1 } from "drizzle-orm/d1";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as tables from "~/server/db/schema.js";

export { tables };

let _db = drizzleD1();
export const useDb = () => {
  if (!_db.session.client) {
    if (process.env.DB) {
      // d1 in production
      _db = drizzleD1(process.env.DB);
    }
    else if (process.dev) {
      // local sqlite in development
      const sqlite = new Database("server/db/db.sqlite");
      _db = drizzle(sqlite);
    }
    else {
      throw new Error("No database configured for production");
    }
  }
  return _db;
};
