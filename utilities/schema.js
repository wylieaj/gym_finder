const Joi = require("joi");

// VALIDATE GYM
module.exports.gymSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  street: Joi.string().required(),
  postcode: Joi.string().required(),
  image: Joi.string().required(),
});
