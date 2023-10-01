const User = require("../models/user");
const catchAsync = require("../utilities/catchAsync.js");
const { isAdmin, passportOptions } = require("../utilities/middleware/middleware.js");
const express = require("express");
const passport = require("passport");
const route = express.Router();

// GET REGISTRATION FORM
route.get("/register", isAdmin, (req, res) => {
  res.render("auths/register.ejs");
});
// REGISTER NEW USER
route.post(
  "/register",
  isAdmin,
  catchAsync(async (req, res) => {
    try {
      const { email, username, password, firstName, lastName, isAdmin } = req.body;
      const userObject = new User({ email, username, firstName, lastName, isAdmin });
      userObject.isAdmin = req.body.isAdmin == undefined ? false : true;
      const newUser = await User.register(userObject, password);
      req.flash("success", "New user has been created!");
      res.redirect("/gyms");
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/register");
    }
  })
);

// GET LOGIN FORM
route.get("/login", (req, res) => {
  res.render("auths/login.ejs");
});
// LOGIN USER
route.post("/login", passport.authenticate("local", passportOptions), (req, res) => {
  req.flash("success", "User logged in!");
  res.redirect("/gyms");
});

// LOGOUT
route.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged out!");
    res.redirect("/gyms");
  });
});

module.exports = route;
