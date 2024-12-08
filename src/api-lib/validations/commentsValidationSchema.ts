// src/validations/CommentsValidation.ts
import Joi from "joi";

export const CreateCommentSchema = Joi.object({
  context: Joi.string().required(),
  taskId: Joi.string()
    .guid({ version: ["uuidv4"] })
    .required(),
});
