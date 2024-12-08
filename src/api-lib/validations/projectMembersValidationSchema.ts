// src/validations/ProjectMembersValidation.ts
import Joi from "joi";

export const CreateProjectMemberSchema = Joi.object({
  projectId: Joi.string().uuid().required(),
  userId: Joi.string().uuid().required(),
});
