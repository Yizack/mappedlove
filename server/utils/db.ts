import * as schema from "../db/schema";

export { sql, eq, and, or, desc, count } from "drizzle-orm";
export const tables = schema;
