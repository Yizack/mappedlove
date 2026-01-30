import * as schema from "../db/schema";

export const tables = schema;
export { sql, eq, and, or, desc, count } from "drizzle-orm";
