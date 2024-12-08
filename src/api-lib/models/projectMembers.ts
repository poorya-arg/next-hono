// src/models/ProjectMembersModel.ts
import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { OrganizationsModel } from "./OrganizationsModel";
import { UsersModel } from "./usersModel";

export const ProjectMembersModel = pgTable("project_members", {
  id: uuid("id")
    .default(sql`uuid_generate_v4()`)
    .primaryKey(),
  projectId: uuid("project_id")
    .references(() => OrganizationsModel.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id")
    .references(() => UsersModel.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
