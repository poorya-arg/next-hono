import Joi from "joi";

const createSchema = Joi.object({
  name: Joi.string().required(),
  slug: Joi.string().required(),
  ownerEmail: Joi.string().email().required(),
});

export { createSchema };
