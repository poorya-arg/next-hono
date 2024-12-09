// src/services/UserRolesService.ts
import { eq, inArray, sql } from "drizzle-orm";
import { db } from "../db";
import { RolesModel } from "../models/rolesModel";
import { UsersModel } from "../models/usersModel";
import { UserRolesModel } from "../models/usersRoles";

const createTableIfNotExist = async () => {
  await db.execute(sql`
          CREATE TABLE IF NOT EXISTS user_roles (
            user_id UUID NOT NULL,
            role_id UUID NOT NULL,
            assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            PRIMARY KEY (user_id, role_id),
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
            FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE ON UPDATE CASCADE
);
        `);
};

async function assignRolesToUser(userId: string, roleIds: string[]) {
  await createTableIfNotExist();
  if (!roleIds || roleIds.length === 0) {
    throw new Error("No role IDs provided.");
  }

  // Start a transaction to ensure atomicity
  return await db.transaction(async (tx) => {
    // Optional: Verify that the user exists
    const userExists = await tx
      .select()
      .from(UsersModel)
      .where(eq(UsersModel.id, userId))
      .limit(1)
      .execute();

    if (userExists.length === 0) {
      throw new Error("User not found.");
    }

    // Optional: Verify that all role IDs exist
    const existingRoles = await tx
      .select()
      .from(RolesModel)
      .where(inArray(RolesModel.id, roleIds))
      .execute();

    if (existingRoles.length !== roleIds.length) {
      throw new Error("One or more roles do not exist.");
    }

    // Prepare the user-role assignments
    const assignments = roleIds.map((roleId) => ({
      userId,
      roleId,
      assignedAt: new Date(),
    }));

    // Insert the assignments, ignoring duplicates
    const result = await tx
      .insert(UserRolesModel)
      .values(assignments)
      .onConflictDoNothing()
      .execute();

    return result;
  });
}

async function getUserRoles(userId: string): Promise<string[]> {
  try {
    const result = await db
      .select({ roleId: UserRolesModel.roleId })
      .from(UserRolesModel)
      .where(eq(UserRolesModel.userId, userId))
      .execute();

    return result.map((row) => row.roleId);
  } catch (error) {
    console.error("Error fetching user roles:", error);
    throw new Error("Failed to fetch user roles.");
  }
}

export { assignRolesToUser, getUserRoles };
