import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";

export const translations = pgTable("translations", {
  id: serial("id").primaryKey(), // auto-increment primary key
  original_text: text("original_text").notNull(),
  translated_text: text("translated_text").notNull(),
  source_language: varchar("source_language", { length: 10 }).notNull(),
  target_language: varchar("target_language", { length: 10 }).notNull(),
  dialect: varchar("dialect", { length: 20 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
  user_id: integer("user_id").references(() => users.id),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password_hash: text("password_hash").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const refresh_tokens = pgTable("refresh_tokens", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id")
    .references(() => users.id)
    .notNull(),
  token: text("token").notNull(),
  expires_at: timestamp("expires_at").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});
