// src/services/RolesService.ts
import { db } from "../db";
import { sql, eq } from "drizzle-orm";
import { CreateRoleSchema } from "../validations/rolesValidationSchema";
import { RolesModel } from "../models/rolesModel";

const createRolesTableIfNotExist = async () => {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS roles (
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

async function createRole(data: any): Promise<any> {
  await createRolesTableIfNotExist();
  const { error } = CreateRoleSchema.validate(data);
  if (error) {
    throw new Error(
      "Invalid input: " + error.details.map((d) => d.message).join(", ")
    );
  }
  const result = await db.insert(RolesModel).values(data).returning().execute();
  return result[0] as any;
}

async function getRoles(): Promise<any[]> {
  try {
    return await db
      .select()
      .from(RolesModel)
      .where(eq(RolesModel.deleted, false))
      .execute();
  } catch (error) {
    console.log(error, "ERROR");
    throw new Error("Failed to fetch roles.");
  }
}

async function updateRole(id: string, data: Partial<any>): Promise<any> {
  try {
    const { error } = CreateRoleSchema.validate(data, { allowUnknown: true });
    if (error) {
      throw new Error(
        "Invalid input: " + error.details.map((d) => d.message).join(", ")
      );
    }
    const result = await db
      .update(RolesModel)
      .set(data)
      .where(eq(RolesModel.id, id))
      .returning()
      .execute();
    if (result.length === 0) {
      throw new Error("Role not found.");
    }
    return result[0] as any;
  } catch (error) {
    throw error;
  }
}

async function deleteRole(id: string): Promise<void> {
  try {
    await db
      .update(RolesModel)
      .set({ deleted: true })
      .where(eq(RolesModel.id, id))
      .execute();
  } catch (error) {
    throw error;
  }
}

export { createRole, getRoles, updateRole, deleteRole };
