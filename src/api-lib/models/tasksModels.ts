import { pgTable, uuid, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { StatusModel } from "./statusModel";
import { LabelsModel } from "./lablesModel";
import { UsersModel } from "./usersModel";
import { OrganizationsModel } from "./OrganizationsModel";

export const TasksModel = pgTable("tasks", {
  id: uuid("id")
    .default(sql`uuid_generate_v4()`)
    .primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  statusId: uuid("status_id")
    .notNull()
    .references(() => StatusModel.id, { onDelete: "cascade" }),
  labelId: uuid("label_id")
    .notNull()
    .references(() => LabelsModel.id, { onDelete: "cascade" }),
  assigneeId: uuid("assignee_id").references(() => UsersModel.id, {
    onDelete: "cascade",
  }),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => OrganizationsModel.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  enabled: boolean("enabled").default(true).notNull(),
  deleted: boolean("deleted").default(false).notNull(),
});
