// src/middleware/auth.ts
import { Context, Next } from "hono";
import { PermissionsService, RolesPermissionsService } from "../services";

// Define the middleware factory function
export default function requirePermission(requiredPermission: string) {
  return async (c: Context, next: Next) => {
    try {
      // Simulate authenticated user
      const user = {
        id: "d2ff44e3-36f6-4aed-b671-cf2b9efafb43", // Hard-coded user ID
        roleId: "425d9f08-cf18-4983-a15e-d892fab98982", // Hard-coded role ID (ensure this exists in your roles table)
      };

      // Fetch role permissions
      const rolePermissions =
        await RolesPermissionsService.getPermissionsByRole(user.roleId);

      if (!rolePermissions || rolePermissions.length === 0) {
        return c.json(
          { message: "Forbidden: No permissions assigned to role." },
          403
        );
      }

      // Extract permission IDs
      const permissionIds = rolePermissions.map((rp) => rp.permissionId);

      // Fetch permission details
      const permissions = await PermissionsService.getPermissionsByIds(
        permissionIds
      );

      // Extract permission names
      const permissionNames = permissions.map((perm) => perm.name);

      // Check if required permission is present
      if (permissionNames.includes(requiredPermission)) {
        // User has the required permission
        await next();
      } else {
        // User lacks the required permission
        return c.json({ message: "Forbidden: Insufficient permissions." }, 403);
      }
    } catch (error) {
      console.error("Authentication Middleware Error:", error);
      return c.json({ message: "Internal Server Error" }, 500);
    }
  };
}
