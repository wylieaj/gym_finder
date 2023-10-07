const Joi = require("joi");

// VALIDATE GYM
module.exports.gymSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  city: Joi.string().required(),
  postcode: Joi.string().required(),
  images: Joi.array().items({
    url: Joi.string().required(),
    filename: Joi.string().required(),
  }),
});
