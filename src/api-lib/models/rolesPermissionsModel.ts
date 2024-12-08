// src/models/RolePermissionsModel.ts
import { pgTable, uuid, boolean, timestamp } from "drizzle-orm/pg-core";
import { RolesModel } from "./rolesModel";
import { PermissionsModel } from "./permissionsModel";

export const RolePermissionsModel = pgTable("role_permissions", {
  roleId: uuid("role_id")
    .notNull()
    .references(() => RolesModel.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  permissionId: uuid("permission_id")
    .notNull()
    .references(() => PermissionsModel.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  grantedAt: timestamp("granted_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
