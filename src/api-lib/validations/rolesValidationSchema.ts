// src/validations/RolesValidation.ts
import Joi from "joi";

export const CreateRoleSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
});
