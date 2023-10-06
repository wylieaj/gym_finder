const { passportOptions } = require("../utilities/middleware/middleware.js");
const express = require("express");
const passport = require("passport");
const route = express.Router();

// GET LOGIN FORM
route.get("/login", (req, res) => {
  res.render("auths/login.ejs");
});
// LOGIN USER
route.post("/login", passport.authenticate("local", passportOptions), (req, res) => {
  req.flash("success", "User logged in!");
  res.redirect("/dashboard");
});

// LOGOUT
route.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged out!");
    res.redirect("/login");
  });
});

module.exports = route;
