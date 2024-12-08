// src/services/UsersService.ts

import { db } from "../db";
import { eq, sql } from "drizzle-orm";
import { UsersModel } from "../models/usersModel";
import bcrypt from "bcrypt";
import { CreateUserSchema } from "../validations/usersValidationSchema";
import { ICreateUser } from "../types/usersType";

const createOrgTableIfNotExist = async () => {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      enabled BOOLEAN NOT NULL DEFAULT true,
      deleted BOOLEAN NOT NULL DEFAULT false
    );
  `);
};

async function createUser(data: ICreateUser) {
  await createOrgTableIfNotExist();

  const { error } = CreateUserSchema.validate(data);
  if (error) {
    throw new Error(
      "Invalid input: " + error.details.map((d) => d.message).join(", ")
    );
  }

  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const userData = {
    ...data,
    password: hashedPassword,
  };

  const result = await db.insert(UsersModel).values(userData).execute();
  return result;
}

async function getUsers() {
  try {
    return await db
      .select()
      .from(UsersModel)
      .where(eq(UsersModel.deleted, false));
  } catch (error) {
    console.log(error, "ERROR");
    throw error;
  }
}

async function deleteUser(userID: string) {
  try {
    const result = await db
      .update(UsersModel)
      .set({ deleted: true })
      .where(eq(UsersModel.id, userID));
    return result.rows;
  } catch (error) {
    throw error;
  }
}

export { getUsers, createUser, deleteUser };
