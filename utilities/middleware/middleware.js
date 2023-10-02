const { gymSchema } = require("../schema.js");
const ExpressError = require("../ExpressError.js");

module.exports.passportOptions = {
  failureFlash: true,
  failureRedirect: "/login",
  keepSessionIfno: true, // REQUIRED TO REDIRECT TO ORIGINAL URL
};

// VALIDATE GYM DATA
module.exports.validateGym = (req, res, next) => {
  const { error } = gymSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// CHECK IF A USER IS AUTHENTICATED
module.exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You don't have authorization to view this content.");
  res.redirect("/login");
};

// CHECK IF THE CURRENT USER IS AN ADMIN
module.exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user["isAdmin"]) {
    return next();
  }
  req.flash("error", "You don't have authorization to view this content.");
  res.redirect("/login");
};
