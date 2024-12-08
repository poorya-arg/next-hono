// src/models/CommentsModel.ts
import { pgTable, uuid, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { TasksModel } from "./tasksModels";

export const CommentsModel = pgTable("comments", {
  id: uuid("id")
    .default(sql`uuid_generate_v4()`)
    .primaryKey(),
  context: text("context").notNull(),
  taskId: uuid("task_id")
    .notNull()
    .references(() => TasksModel.id, { onDelete: "cascade" }), // Foreign key reference
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  enabled: boolean("enabled").default(true).notNull(),
  deleted: boolean("deleted").default(false).notNull(),
});
