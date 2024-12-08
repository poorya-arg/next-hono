import { pgTable, uuid, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const LabelsModel = pgTable("labels", {
  id: uuid("id")
    .default(sql`uuid_generate_v4()`)
    .primaryKey(),
  title: text("title").notNull(),
  colorCode: text("color_code").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  enabled: boolean("enabled").default(true).notNull(),
  deleted: boolean("deleted").default(false).notNull(),
});
