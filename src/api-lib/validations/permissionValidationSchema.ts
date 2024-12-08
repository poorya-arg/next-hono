// src/validations/PermissionsValidation.ts
import Joi from "joi";

export const CreatePermissionSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
});
