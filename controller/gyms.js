const ObjectID = require("mongoose").Types.ObjectId;
const Gym = require("../models/gym");
const ExpressError = require("../utilities/ExpressError.js");
const catchAsync = require("../utilities/catchAsync.js");

// DISPLAY ALL GYMS - NO LOGIN
module.exports.displayAllGyms = catchAsync(async (req, res) => {
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(req.query.search), "gi");
    const gyms = await Gym.find({ city: regex });
    const allGyms = await Gym.find({});
    res.render("gyms/gyms-index.ejs", { gyms, allGyms });
  } else {
    const allGyms = await Gym.find({});
    const gyms = [];
    res.render("gyms/gyms-index.ejs", { gyms, allGyms });
  }
});

// DISPLAY SPECIFIC GYM - NO LOGIN
module.exports.displayGym = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!ObjectID.isValid(id)) {
    return next(new ExpressError("Sorry, the gym you were looking for cannot be found.", 400));
  }
  const gym = await Gym.findById(id).populate("plans");
  if (!gym) {
    return next(new ExpressError("Sorry, the gym you were looking for cannot be found.", 404));
  }
  res.render("gyms/gyms-show.ejs", { gym });
});

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}
