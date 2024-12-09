// src/models/UserRolesModel.ts
import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { RolesModel } from "./rolesModel";
import { UsersModel } from "./usersModel";

export const UserRolesModel = pgTable("user_roles", {
  userId: uuid("user_id")
    .notNull()
    .references(() => UsersModel.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  roleId: uuid("role_id")
    .notNull()
    .references(() => RolesModel.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  assignedAt: timestamp("assigned_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
