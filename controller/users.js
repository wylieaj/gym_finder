const User = require("../models/user");
const catchAsync = require("../utilities/catchAsync.js");
const express = require("express");

// DISPLAY ALL USERS
module.exports.usersIndex = catchAsync(async (req, res) => {
  const allUsers = await User.find();
  res.render("users/users-index.ejs", { allUsers });
});

// GET REGISTRATION FORM
module.exports.getRegisterForm = (req, res) => {
  res.render("users/users-register.ejs");
};

// REGISTER NEW USER
module.exports.registerUser = catchAsync(async (req, res) => {
  try {
    const { email, username, password, firstName, lastName, isAdmin } = req.body;
    const userObject = new User({ email, username, firstName, lastName, isAdmin });
    userObject.isAdmin = req.body.isAdmin == undefined ? false : true;
    const newUser = await User.register(userObject, password);
    req.flash("success", "New user has been created!");
    res.redirect("/dashboard/users");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/dashboard/users/new");
  }
});

// DELETE USER
module.exports.deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (id) {
    const user = await User.findByIdAndDelete(id);
    req.flash("success", `${user.username} has been deleted!`);
    res.redirect("/dashboard/users");
  }
  req.flash("error", "Unable to delete user");
  res.redirect("/dashboard/users");
});
