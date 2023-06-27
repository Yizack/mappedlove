import { sqliteTable, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  country: text("country"),
  address: text("address"),
  joined: integer("joined").notNull(),
  confirmed: integer("confirmed").notNull()
}, table => ({
  emailIndex: uniqueIndex("email_index").on(table.email)
}));

export const bonds = sqliteTable("bonds", {
  id: integer("id").primaryKey(),
  user: integer("user").notNull().references(() => users.id),
  partner: integer("partner").notNull().references(() => users.id)
});

export const groups = sqliteTable("groups", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull()
});

export const markers = sqliteTable("markers", {
  id: integer("id").primaryKey(),
  bond: integer("user").notNull().references(() => bonds.id),
  lat: integer("lat").notNull(),
  lng: integer("lng").notNull(),
  group: integer("group").notNull().references(() => groups.id),
  title: text("title").notNull(),
  description: text("description").notNull()
});

export const stories = sqliteTable("stories", {
  id: integer("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  marker: integer("marker").notNull().references(() => markers.id)
});
