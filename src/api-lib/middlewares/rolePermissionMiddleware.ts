// src/middleware/auth.ts
import { Context, Next } from "hono";
import { verifyToken } from "../utils/jtw";
import {
  PermissionsService,
  RolesPermissionsService,
  UserRolesService,
} from "../services";

/**
 * Middleware to require a valid JWT token and optionally check for specific permissions.
 * @param requiredPermission - (Optional) The permission required to access the route.
 */
export default function requirePermission(requiredPermission?: string) {
  return async (c: Context, next: Next) => {
    try {
      // 1. Extract the token from the Authorization header
      const authHeader = c.req.header("Authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return c.json({ message: "Unauthorized: No token provided." }, 401);
      }

      const token = authHeader.split(" ")[1];

      // 2. Verify the token
      let payload: { userId: string };
      try {
        payload = verifyToken(token as string);
      } catch (err) {
        return c.json({ message: "Unauthorized: Invalid token." }, 401);
      }

      const userId = payload.userId;

      // 3. Attach userId to the context
      c.set("userId", userId);

      // 4. If a required permission is specified, check if the user has it
      if (requiredPermission) {
        // a. Retrieve user's roles
        const userRoles = await UserRolesService.getUserRoles(userId);
        if (!userRoles || userRoles.length === 0) {
          return c.json(
            { message: "Forbidden: No roles assigned to user." },
            403
          );
        }
        console.log(userRoles);

        // b. Retrieve permissions for these roles
        const rolePermissions =
          await RolesPermissionsService.getPermissionsByRoles(userRoles);
        if (!rolePermissions || rolePermissions.length === 0) {
          return c.json(
            { message: "Forbidden: No permissions assigned to roles." },
            403
          );
        }
        console.log(rolePermissions);

        // c. Extract permission names
        const permissionIds = rolePermissions.map((rp) => rp.permissionId);
        const permissions = await PermissionsService.getPermissionsByIds(
          permissionIds
        );
        const permissionNames = permissions.map((perm) => perm.name);

        // d. Check if the required permission is present
        if (!permissionNames.includes(requiredPermission)) {
          return c.json(
            { message: "Forbidden: Insufficient permissions." },
            403
          );
        }
        console.log(permissionNames);
      }
      c.set("userId", userId);
      // 5. Proceed to the next middleware or route handler
      await next();
    } catch (error) {
      console.error("Authentication Middleware Error:", error);
      return c.json({ message: "Internal Server Error" }, 500);
    }
  };
}
