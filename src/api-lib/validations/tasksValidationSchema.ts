import Joi from "joi";

export const CreateTaskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  statusId: Joi.string().uuid().required(),
  labelId: Joi.string().uuid().required(),
  organizationId: Joi.string().uuid().required(),
});

export const AssignTaskSchema = Joi.object({
  userId: Joi.string()
    .guid({ version: ["uuidv4"] })
    .required(),
});
