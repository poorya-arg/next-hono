// src/utils/jwt.ts
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Secret key for signing tokens (ensure this is stored securely, e.g., environment variables)
const JWT_SECRET =
  process.env.JWT_SECRET || "Uds5FliZOfZIY8ItxaCwnNHlGJzOAxqlxm6QgT8MvHI=";

// Token expiration time (e.g., 1 hour)
const JWT_EXPIRES_IN = "1h";

/**
 * Generates a JWT token for a given user ID.
 * @param userId - The ID of the user.
 * @returns A signed JWT token.
 */
export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verifies a JWT token and extracts the payload.
 * @param token - The JWT token to verify.
 * @returns The decoded payload if valid.
 * @throws Error if the token is invalid or expired.
 */
export function verifyToken(token: string): { userId: string } {
  return jwt.verify(token, JWT_SECRET) as { userId: string };
}
