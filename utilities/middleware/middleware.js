const { gymSchema } = require("../schema.js");
const ExpressError = require("../ExpressError.js");

module.exports.validateGym = (req, res, next) => {
  const { error } = gymSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
