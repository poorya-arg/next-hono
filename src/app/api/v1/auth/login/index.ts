// src/routes/login.ts
import { AuthService } from "@/api-lib/services";
import { ILoginRequest, ILoginResponse } from "@/api-lib/types/authType";
import { LoginSchema } from "@/api-lib/validations/loginValidationSchema";
import { Hono } from "hono";
import { Context } from "hono";

const loginApp = new Hono();

/**
 * POST /api/v1/login
 * Authenticates a user and returns a JWT token.
 */
loginApp.post("/", async (c: Context) => {
  try {
    const body = await c.req.json();

    // Validate request body
    const { error, value } = LoginSchema.validate(body);
    if (error) {
      return c.json(
        { message: "Validation Error", details: error.details },
        400
      );
    }

    const { email, password } = value as ILoginRequest;

    // Authenticate user and generate token
    const token = await AuthService.login(email, password);

    const response: ILoginResponse = { token };

    return c.json(response, 200);
  } catch (error: any) {
    if (
      error.message === "Invalid email or password." ||
      error.message === "User not found."
    ) {
      return c.json({ message: error.message }, 401);
    }
    console.error("Login Error:", error);
    return c.json({ message: "Internal Server Error: " + error.message }, 500);
  }
});

export default loginApp;
