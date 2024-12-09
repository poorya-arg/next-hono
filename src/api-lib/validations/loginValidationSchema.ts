// src/validations/AuthValidation.ts
import Joi from "joi";

export const LoginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": `"email" should be a type of 'text'`,
    "string.email": `"email" must be a valid email`,
    "any.required": `"email" is a required field`,
  }),
  password: Joi.string().min(8).required().messages({
    "string.base": `"password" should be a type of 'text'`,
    "string.min": `"password" should have a minimum length of {#limit}`,
    "any.required": `"password" is a required field`,
  }),
});
