// src/services/PermissionsService.ts
import { db } from "../db";
import { sql, eq, inArray } from "drizzle-orm";
import { CreatePermissionSchema } from "../validations/permissionValidationSchema";
import { PermissionsModel } from "../models/permissionsModel";

const createPermissionsTableIfNotExist = async () => {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS permissions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      enabled BOOLEAN NOT NULL DEFAULT true,
      deleted BOOLEAN NOT NULL DEFAULT false
    );
  `);
};

async function createPermission(data: any) {
  await createPermissionsTableIfNotExist();
  const { error } = CreatePermissionSchema.validate(data);
  if (error) {
    throw new Error(
      "Invalid input: " + error.details.map((d) => d.message).join(", ")
    );
  }
  const result = await db
    .insert(PermissionsModel)
    .values(data)
    .returning()
    .execute();
  return result[0] as any;
}

async function getPermissions(): Promise<any[]> {
  try {
    return await db
      .select()
      .from(PermissionsModel)
      .where(eq(PermissionsModel.deleted, false))
      .execute();
  } catch (error) {
    console.log(error, "ERROR");
    throw new Error("Failed to fetch permissions.");
  }
}

async function updatePermission(id: string, data: Partial<any>): Promise<any> {
  try {
    const { error } = CreatePermissionSchema.validate(data, {
      allowUnknown: true,
    });
    if (error) {
      throw new Error(
        "Invalid input: " + error.details.map((d) => d.message).join(", ")
      );
    }
    const result = await db
      .update(PermissionsModel)
      .set(data)
      .where(eq(PermissionsModel.id, id))
      .returning()
      .execute();
    if (result.length === 0) {
      throw new Error("Permission not found.");
    }
    return result[0] as any;
  } catch (error) {
    throw error;
  }
}

// NEW: Fetch permissions by a list of IDs
async function getPermissionsByIds(ids: string[]): Promise<any[]> {
  try {
    return await db
      .select()
      .from(PermissionsModel)
      .where(inArray(PermissionsModel.id, ids))
      .execute();
  } catch (error) {
    console.log(error, "ERROR");
    throw new Error("Failed to fetch permissions by IDs.");
  }
}
async function deletePermission(id: string): Promise<void> {
  try {
    await db
      .update(PermissionsModel)
      .set({ deleted: true })
      .where(eq(PermissionsModel.id, id))
      .execute();
  } catch (error) {
    throw error;
  }
}

export {
  createPermission,
  getPermissions,
  updatePermission,
  deletePermission,
  getPermissionsByIds,
};
