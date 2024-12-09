// src/services/AuthService.ts
import { db } from "../db";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { UsersModel } from "../models/usersModel";
import { IUser } from "../types/usersType";
import { generateToken } from "../utils/jtw";

/**
 * Authenticates a user with email and password.
 * @param email - The user's email.
 * @param password - The user's password.
 * @returns A JWT token if authentication is successful.
 * @throws Error if authentication fails.
 */
async function login(email: string, password: string): Promise<string> {
  // Fetch the user by email
  const userResult = await db
    .select()
    .from(UsersModel)
    .where(eq(UsersModel.email, email))
    .execute();

  if (userResult.length === 0) {
    throw new Error("Invalid email or password.");
  }

  //   @ts-ignore
  const user = userResult[0] as IUser;

  // Verify the password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password.");
  }

  // Generate JWT token
  const token = generateToken(user.id);
  return token;
}

export { login };
