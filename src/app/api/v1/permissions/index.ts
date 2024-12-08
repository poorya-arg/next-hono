// src/routes/permissions.ts
import { PermissionsService } from "@/api-lib/services";
import { Hono } from "hono";

const permissionsApp = new Hono();

// GET /api/v1/permissions
permissionsApp.get("/", async (c) => {
  try {
    const permissions = await PermissionsService.getPermissions();
    return c.json(permissions);
  } catch (error) {
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

// POST /api/v1/permissions/create
permissionsApp.post("/create", async (c) => {
  try {
    const permissionData = await c.req.json();
    const newPermission = await PermissionsService.createPermission(
      permissionData
    );
    return c.json(newPermission);
  } catch (error: any) {
    return c.json({ message: "Internal Server Error: " + error.message }, 500);
  }
});

// PUT /api/v1/permissions/:id
permissionsApp.put("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const updateData = await c.req.json();
    const updatedPermission = await PermissionsService.updatePermission(
      id,
      updateData
    );
    return c.json(updatedPermission);
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

// DELETE /api/v1/permissions/:id
permissionsApp.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await PermissionsService.deletePermission(id);
    return c.json({ message: "Permission Deleted!" });
  } catch (error) {
    return c.json({ message: "Failed to delete" }, 500);
  }
});

export default permissionsApp;
