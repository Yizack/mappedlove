import { sqliteTable, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  country: text("country"),
  address: text("address"),
  birthDate: integer("birth_date"),
  showAvatar: integer("show_avatar").notNull().default(0),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
  confirmed: integer("confirmed").notNull().default(0)
}, table => ({
  emailIndex: uniqueIndex("email_index").on(table.email)
}));

export const bonds = sqliteTable("bonds", {
  id: integer("id").primaryKey(),
  partner1: integer("partner_1").notNull().references(() => users.id),
  partner2: integer("partner_2").notNull().references(() => users.id),
  couple_date: integer("couple_date").notNull(),
  public: integer("public").notNull()
});

export const groups = sqliteTable("groups", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull()
});

export const markers = sqliteTable("markers", {
  id: integer("id").primaryKey(),
  lat: integer("lat").notNull(),
  lng: integer("lng").notNull(),
  group: integer("group").notNull().references(() => groups.id),
  bond: integer("user").notNull().references(() => bonds.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  order: integer("order").notNull()
});

export const stories = sqliteTable("stories", {
  id: integer("id").primaryKey(),
  marker: integer("marker").notNull().references(() => markers.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: integer("date").notNull()
});
