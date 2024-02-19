import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  country: text("country"),
  birthDate: integer("birth_date"),
  showAvatar: integer("show_avatar").notNull().default(0),
  confirmed: integer("confirmed").notNull().default(0),
  premium: integer("premium").notNull().default(0),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const bonds = sqliteTable("bonds", {
  id: integer("id").primaryKey(),
  code: text("code").notNull().unique(),
  partner1: integer("partner_1").references(() => users.id, { onDelete: "set null" }),
  partner2: integer("partner_2").references(() => users.id, { onDelete: "set null" }),
  coupleDate: integer("couple_date"),
  bonded: integer("bonded").notNull().default(0),
  public: integer("public").notNull().default(0),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const markers = sqliteTable("markers", {
  id: integer("id").primaryKey(),
  lat: integer("lat").notNull(),
  lng: integer("lng").notNull(),
  group: integer("group").notNull(),
  bond: integer("user").notNull().references(() => bonds.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  order: integer("order").notNull(),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const stories = sqliteTable("stories", {
  id: integer("id").primaryKey(),
  marker: integer("marker").notNull().references(() => markers.id, { onDelete: "cascade" }),
  bond: integer("user").notNull().references(() => bonds.id, { onDelete: "cascade" }),
  user: integer("user").notNull().references(() => users.id, { onDelete: "cascade" }),
  description: text("description").notNull().default(""),
  year: integer("year").notNull().default(0),
  month: integer("month").notNull().default(0),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});
