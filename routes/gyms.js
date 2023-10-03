const ObjectID = require("mongoose").Types.ObjectId;
const Gym = require("../models/gym");
const ExpressError = require("../utilities/ExpressError.js");
const catchAsync = require("../utilities/catchAsync.js");
const express = require("express");
const route = express.Router();

// DISPLAY ALL GYMS
route.get(
  "/",
  catchAsync(async (req, res) => {
    const allGyms = await Gym.find({});
    res.render("gyms/gyms-index.ejs", { allGyms });
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
    res.render("gyms/gyms-show.ejs", { gym });
  })
);

module.exports = route;
