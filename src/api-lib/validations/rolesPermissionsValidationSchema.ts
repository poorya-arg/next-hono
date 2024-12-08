// src/validations/RolePermissionsValidation.ts
import Joi from "joi";

export const AssignPermissionToRoleSchema = Joi.object({
  roleId: Joi.string()
    .guid({ version: ["uuidv4"] })
    .required(),
  permissionId: Joi.string()
    .guid({ version: ["uuidv4"] })
    .required(),
});
