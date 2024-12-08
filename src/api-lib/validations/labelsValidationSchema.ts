import Joi from "joi";

export const CreateLabelSchema = Joi.object({
  title: Joi.string().required(),
  colorCode: Joi.string().required(),
});
