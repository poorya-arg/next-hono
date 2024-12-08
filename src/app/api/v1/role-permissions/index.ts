// src/routes/rolePermissions.ts
import { RolesPermissionsService } from "@/api-lib/services";
import { Hono } from "hono";

const rolePermissionsApp = new Hono();

// POST /api/v1/role-permissions/assign
rolePermissionsApp.post("/assign", async (c) => {
  try {
    const assignData = await c.req.json();
    const assignedPermission =
      await RolesPermissionsService.assignPermissionToRole(assignData);
    return c.json(assignedPermission);
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

// POST /api/v1/role-permissions/remove
rolePermissionsApp.post("/remove", async (c) => {
  try {
    const removeData = await c.req.json();
    await RolesPermissionsService.removePermissionFromRole(removeData);
    return c.json({ message: "Permission Removed from Role" });
  } catch (error: any) {
    if (error.message.includes("Invalid input")) {
      return c.json({ message: error.message }, 400); // Bad Request
    }
    return c.json({ message: "Internal Server Error: " + error.message }, 500);
  }
});

// GET /api/v1/role-permissions/:roleId
rolePermissionsApp.get("/:roleId", async (c) => {
  try {
    const roleId = c.req.param("roleId");
    const permissions = await RolesPermissionsService.getPermissionsByRole(
      roleId
    );
    return c.json(permissions);
  } catch (error) {
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

export default rolePermissionsApp;
