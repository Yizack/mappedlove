import { drizzle } from "drizzle-orm/d1";
import * as schema from "../database/schema";

export { sql, eq, and, or, desc, count } from "drizzle-orm";
export const tables = schema;

export const useDB = () => {
  return drizzle(hubDatabase(), { schema, casing: "snake_case" });
};
