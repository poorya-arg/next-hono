import Joi from "joi";

export const CreateStatusSchema = Joi.object({
  title: Joi.string().required(),
});
