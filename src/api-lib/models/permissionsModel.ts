// src/models/PermissionsModel.ts
import { pgTable, uuid, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const PermissionsModel = pgTable("permissions", {
  id: uuid("id")
    .default(sql`uuid_generate_v4()`)
    .primaryKey(),
  name: text("name").notNull().unique(), // Unique permission name
  description: text("description").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  enabled: boolean("enabled").default(true).notNull(),
  deleted: boolean("deleted").default(false).notNull(),
});
