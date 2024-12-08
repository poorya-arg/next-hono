// src/services/RolePermissionsService.ts
import { db } from "../db";
import { sql, eq, and } from "drizzle-orm";
import { AssignPermissionToRoleSchema } from "../validations/rolesPermissionsValidationSchema";
import { RolesModel } from "../models/rolesModel";
import { PermissionsModel } from "../models/permissionsModel";
import { RolePermissionsModel } from "../models/rolesPermissionsModel";

const createRolePermissionsTableIfNotExist = async () => {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS role_permissions (
      role_id UUID NOT NULL,
      permission_id UUID NOT NULL,
      granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY (role_id, permission_id),
      CONSTRAINT fk_role
        FOREIGN KEY(role_id)
          REFERENCES roles(id)
          ON DELETE CASCADE
          ON UPDATE CASCADE,
      CONSTRAINT fk_permission
        FOREIGN KEY(permission_id)
          REFERENCES permissions(id)
          ON DELETE CASCADE
          ON UPDATE CASCADE
    );
  `);
};

async function assignPermissionToRole(data: any): Promise<any> {
  await createRolePermissionsTableIfNotExist();
  const { error } = AssignPermissionToRoleSchema.validate(data);
  if (error) {
    throw new Error(
      "Invalid input: " + error.details.map((d) => d.message).join(", ")
    );
  }

  const { roleId, permissionId } = data;

  // Check if role exists and is not deleted
  const role = await db
    .select()
    .from(RolesModel)
    .where(eq(RolesModel.id, roleId))
    .execute();

  if (role.length === 0) {
    throw new Error("Role not found.");
  }

  // Check if permission exists and is not deleted
  const permission = await db
    .select()
    .from(PermissionsModel)
    .where(eq(PermissionsModel.id, permissionId))
    .execute();

  if (permission.length === 0) {
    throw new Error("Permission not found.");
  }

  // Assign permission to role
  const result = await db
    .insert(RolePermissionsModel)
    .values(data)
    .returning()
    .execute();
  return result[0] as any;
}

async function removePermissionFromRole(data: any): Promise<void> {
  await createRolePermissionsTableIfNotExist();
  const { error } = AssignPermissionToRoleSchema.validate(data);
  if (error) {
    throw new Error(
      "Invalid input: " + error.details.map((d) => d.message).join(", ")
    );
  }

  const { roleId, permissionId } = data;

  await db
    .delete(RolePermissionsModel)
    .where(
      and(
        eq(RolePermissionsModel.roleId, roleId),
        eq(RolePermissionsModel.permissionId, permissionId)
      )
    )
    .execute();
}

async function getPermissionsByRole(roleId: string): Promise<any[]> {
  await createRolePermissionsTableIfNotExist();
  return await db
    .select()
    .from(RolePermissionsModel)
    .where(eq(RolePermissionsModel.roleId, roleId))
    .execute();
}

export {
  assignPermissionToRole,
  removePermissionFromRole,
  getPermissionsByRole,
};
