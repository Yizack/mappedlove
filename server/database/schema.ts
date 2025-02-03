import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer().primaryKey({ autoIncrement: true }),
  email: text().notNull().unique(),
  password: text(),
  name: text().notNull(),
  country: text(),
  birthDate: integer(),
  showAvatar: integer({ mode: "boolean" }).notNull().default(false),
  auth: integer({ mode: "boolean" }).notNull().default(false),
  confirmed: integer({ mode: "boolean" }).notNull().default(false),
  createdAt: integer().notNull(),
  updatedAt: integer().notNull()
});

export const bonds = sqliteTable("bonds", {
  id: integer().primaryKey({ autoIncrement: true }),
  code: text().notNull().unique(),
  partner1: integer("partner_1").references(() => users.id, { onDelete: "set null" }),
  partner2: integer("partner_2").references(() => users.id, { onDelete: "set null" }),
  coupleDate: integer(),
  bonded: integer({ mode: "boolean" }).notNull().default(false),
  public: integer({ mode: "boolean" }).notNull().default(false),
  premium: integer({ mode: "boolean" }).notNull().default(false),
  subscriptionId: text(),
  nextPayment: integer(),
  createdAt: integer().notNull(),
  updatedAt: integer().notNull()
});

export const markers = sqliteTable("markers", {
  id: integer().primaryKey({ autoIncrement: true }),
  lat: integer().notNull(),
  lng: integer().notNull(),
  group: integer().notNull(),
  bond: integer().notNull().references(() => bonds.id, { onDelete: "cascade" }),
  title: text().notNull(),
  description: text().notNull(),
  order: integer().notNull(),
  createdAt: integer().notNull(),
  updatedAt: integer().notNull()
});

export const stories = sqliteTable("stories", {
  id: integer().primaryKey({ autoIncrement: true }),
  marker: integer().notNull().references(() => markers.id, { onDelete: "cascade" }),
  bond: integer().notNull().references(() => bonds.id, { onDelete: "cascade" }),
  user: integer().notNull(),
  description: text(),
  year: integer().notNull().default(0),
  month: integer().notNull().default(0),
  createdAt: integer().notNull(),
  updatedAt: integer().notNull()
});

export const logins = sqliteTable("logins", {
  user: integer().notNull().primaryKey().references(() => users.id, { onDelete: "cascade" }),
  attempts: integer().notNull().default(1),
  updatedAt: integer().notNull()
});
