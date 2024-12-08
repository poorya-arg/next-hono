// src/routes/users.ts
import { UsersService } from "@/api-lib/services";
import { Hono } from "hono";

const usersApp = new Hono();

// GET /api/v1/users
usersApp.get("/", async (c) => {
  try {
    const users = await UsersService.getUsers();
    return c.json(users);
  } catch (error) {
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

// POST /api/v1/users/create
usersApp.post("/create", async (c) => {
  try {
    const userData = await c.req.json();
    const newUser = await UsersService.createUser(userData);
    return c.json(newUser);
  } catch (error: any) {
    return c.json({ message: "Internal Server Error: " + error.message }, 500);
  }
});

usersApp.delete("/:id", async (c) => {
  try {
    const id = await c.req.param("id");
    await UsersService.deleteUser(id);
    return c.json({ message: "User Deleted!" });
  } catch (error) {
    return c.json({ message: "Failed to delete" }, 500);
  }
});

export default usersApp;
