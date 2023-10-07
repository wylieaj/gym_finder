const baseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value) return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = baseJoi.extend(extension);

// VALIDATE GYM
module.exports.gymSchema = Joi.object({
  name: Joi.string().required().escapeHTML(),
  description: Joi.string().required().escapeHTML(),
  city: Joi.string().required().escapeHTML(),
  postcode: Joi.string().required().escapeHTML(),
  images: Joi.array().items({
    url: Joi.string().required().escapeHTML(),
    filename: Joi.string().required().escapeHTML(),
  }),
});
