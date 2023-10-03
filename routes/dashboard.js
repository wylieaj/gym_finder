const ObjectID = require("mongoose").Types.ObjectId;
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

// GET EDIT FORM
route.get(
  "/gyms/:id/edit",
  isAdmin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    console.log(id);
    if (!ObjectID.isValid(id)) {
      return next(new ExpressError("Sorry, the gym you were looking for cannot be found.", 400));
    }
    const gym = await Gym.findById(id);
    if (!gym) {
      return next(new ExpressError("Sorry, the gym you were looking for cannot be found.", 404));
    }
    res.render("dashboard/edit.ejs", { gym });
  })
);
// UPDATE GYM
route.put(
  "/gyms/:id",
  isAdmin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
    await Gym.findByIdAndUpdate(id, updatedData);
    req.flash("success", `${updatedData.name} has been updated!`);
    res.redirect("/dashboard/gyms");
  })
);

// DELETE GYM
route.delete(
  "/:id",
  isAdmin,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const gym = await Gym.findByIdAndDelete(id);
    req.flash("success", `${gym.name} has been deleted.`);
    res.redirect("/dashboard/gyms");
  })
);

module.exports = route;
