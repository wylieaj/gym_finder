const ObjectID = require("mongoose").Types.ObjectId;
const Gym = require("../models/gym");
const catchAsync = require("../utilities/catchAsync.js");
const { validateGym } = require("../utilities/middleware/middleware.js");
const express = require("express");
const route = express.Router();

// DISPLAY ALL GYMS
route.get(
  "/",
  catchAsync(async (req, res) => {
    const allGyms = await Gym.find({});
    res.render("gyms/index.ejs", { allGyms });
  })
);

// RENDER NEW GYM FORM
route.get("/new", (req, res) => {
  res.render("gyms/new.ejs");
});

// SUBMIT NEW GYM
route.post(
  "/",
  validateGym,
  catchAsync(async (req, res) => {
    const newGym = new Gym(req.body);
    await newGym.save();
    req.flash("success", "Your gym has successfully been added.");
    res.redirect(`/gyms/${newGym._id}`);
  })
);

// DISPLAY GYM BY ID
route.get(
  "/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    if (!ObjectID.isValid(id)) {
      return next(new ExpressError("Sorry, the gym you were looking for cannot be found.", 400));
    }
    const gym = await Gym.findById(id);
    if (!gym) {
      return next(new ExpressError("Sorry, the gym you were looking for cannot be found.", 404));
    }
    res.render("gyms/show.ejs", { gym });
  })
);

// GET GYM UPDATE FORM
route.get(
  "/:id/edit",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    if (!ObjectID.isValid(id)) {
      return next(new ExpressError("Sorry, the gym you were looking for cannot be found.", 400));
    }
    const gym = await Gym.findById(id);
    if (!gym) {
      return next(new ExpressError("Sorry, the gym you were looking for cannot be found.", 404));
    }
    res.render("gyms/edit.ejs", { gym });
  })
);

// UPDATE GYM
route.put(
  "/:id",
  validateGym,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const updatedGymData = req.body;
    const updatedGym = await Gym.findByIdAndUpdate(id, updatedGymData, { new: true });
    req.flash("success", "Gym updated!");
    res.redirect(`/gyms/${id}`);
  })
);

// DELETE GYM
route.delete(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Gym.findByIdAndDelete(id);
    req.flash("success", "Gym deleted.");
    res.redirect("/gyms");
  })
);

module.exports = route;
