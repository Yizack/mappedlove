import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer().primaryKey({ autoIncrement: true }),
  email: text().notNull().unique(),
  password: text(),
  name: text().notNull(),
  country: text(),
  birthDate: integer(),
  showAvatar: integer({ mode: "boolean" }).notNull().default(false),
  language: text().notNull().$type<MappedLoveLocales>().default("en"),
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
}, table => [
  index("bonds_partner_1_idx").on(table.partner1),
  index("bonds_partner_2_idx").on(table.partner2)
]);

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
}, table => [
  index("markers_bond_idx").on(table.bond)
]);

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
}, table => [
  index("stories_bond_idx").on(table.bond),
  index("stories_marker_idx").on(table.marker)
]);

export const logins = sqliteTable("logins", {
  user: integer().notNull().primaryKey().references(() => users.id, { onDelete: "cascade" }),
  attempts: integer().notNull().default(1),
  updatedAt: integer().notNull()
});
