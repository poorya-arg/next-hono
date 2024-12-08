// src/routes/roles.ts
import { RolesService } from "@/api-lib/services";
import { Hono } from "hono";

const rolesApp = new Hono();

// GET /api/v1/roles
rolesApp.get("/", async (c) => {
  try {
    const roles = await RolesService.getRoles();
    return c.json(roles);
  } catch (error) {
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

// POST /api/v1/roles/create
rolesApp.post("/create", async (c) => {
  try {
    const roleData = await c.req.json();
    const newRole = await RolesService.createRole(roleData);
    return c.json(newRole);
  } catch (error: any) {
    return c.json({ message: "Internal Server Error: " + error.message }, 500);
  }
});

// PUT /api/v1/roles/:id
rolesApp.put("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updateData = await c.req.json();
    const updatedRole = await RolesService.updateRole(id, updateData);
    return c.json(updatedRole);
  } catch (error: any) {
    if (error.message.includes("Invalid input")) {
      return c.json({ message: error.message }, 400); // Bad Request
    }
    if (error.message.includes("not found")) {
      return c.json({ message: error.message }, 404); // Not Found
    }
    return c.json({ message: "Internal Server Error: " + error.message }, 500);
  }
});

// DELETE /api/v1/roles/:id
rolesApp.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await RolesService.deleteRole(id);
    return c.json({ message: "Role Deleted!" });
  } catch (error) {
    return c.json({ message: "Failed to delete" }, 500);
  }
});

export default rolesApp;
