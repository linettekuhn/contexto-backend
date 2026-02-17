import { pgTable, serial, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const translations = pgTable("translations", {
  id: serial("id").primaryKey(), // auto-increment primary key
  original_text: text("original_text").notNull(),
  translated_text: text("translated_text").notNull(),
  source_language: varchar("source_language", { length: 10 }).notNull(),
  target_language: varchar("target_language", { length: 10 }).notNull(),
  dialect: varchar("dialect", { length: 20 }).notNull(),
  created_at: timestamp("created_at").defaultNow(),
});
