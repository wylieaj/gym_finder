const Gym = require("../models/gym");
const User = require("../models/user");
const ExpressError = require("../utilities/ExpressError.js");
const catchAsync = require("../utilities/catchAsync.js");
const { validateGym, isLoggedIn, isAdmin } = require("../utilities/middleware/middleware.js");
const express = require("express");
const route = express.Router();

// RETRIEVE THE DASHBOARD
route.get(
  "/",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const allGyms = await Gym.find({});
    const allUsers = await User.find({});
    res.render("dashboard/dashboard.ejs", { allGyms, allUsers });
  })
);

// DISPLAY ALL GYMS (DASHBOARD)
route.get(
  "/gyms",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const allGyms = await Gym.find({});
    res.render("dashboard/gyms-index.ejs", { allGyms });
  })
);

// DELETE GYM
route.delete(
  "/:id",
  isAdmin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Gym.findByIdAndDelete(id);
    req.flash("success", "Gym deleted!");
    res.redirect("/dashboard/gyms");
  })
);

module.exports = route;
