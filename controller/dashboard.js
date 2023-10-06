const ObjectID = require("mongoose").Types.ObjectId;
const Gym = require("../models/gym");
const User = require("../models/user");
const Plan = require("../models/plan");
const ExpressError = require("../utilities/ExpressError.js");
const catchAsync = require("../utilities/catchAsync.js");
const { cloudinary } = require("../cloudinary");

// GET DASHBOARD ROUTE
module.exports.getDashboard = catchAsync(async (req, res) => {
  const allGyms = await Gym.find({});
  const allUsers = await User.find({});
  res.render("dashboard/dashboard.ejs", { allGyms, allUsers });
});

// GET LIST OF ALL GYMS ROUTE
module.exports.allGymsList = catchAsync(async (req, res) => {
  const allGyms = await Gym.find({}).populate("plans");
  res.render("dashboard/dashboard-index.ejs", { allGyms });
});

// GET NEW GYM FORM ROUTE
module.exports.getNewGymForm = (req, res) => {
  res.render("dashboard/dashboard-new.ejs");
};

// CREATE NEW GYM ROUTE
module.exports.createNewGym = catchAsync(async (req, res) => {
  const newGym = new Gym(req.body);
  newGym.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  await newGym.save();
  req.flash("success", "Your gym has successfully been added.");
  res.redirect(`/dashboard/gyms`);
});

// GET EDIT GYM FORM ROUTE
module.exports.getEditForm = catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  if (!ObjectID.isValid(id)) {
    return next(new ExpressError("Sorry, the gym you were looking for cannot be found.", 400));
  }
  const gym = await Gym.findById(id);
  if (!gym) {
    return next(new ExpressError("Sorry, the gym you were looking for cannot be found.", 404));
  }
  res.render("dashboard/dashboard-edit.ejs", { gym });
});

// UPDATE GYM ROUTE
module.exports.updateGym = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  const updatedGym = await Gym.findByIdAndUpdate(id, updatedData);
  const newImg = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  updatedGym.images.push(...newImg);
  await updatedGym.save();
  req.flash("success", `${updatedData.name} has been updated!`);
  res.redirect("/dashboard/gyms");
});

// DELETE GYM AND ASSOCIATED PLANS ROUTE
module.exports.deleteGym = catchAsync(async (req, res) => {
  const { id } = req.params;
  const gym = await Gym.findByIdAndDelete(id).populate("plans");
  if (gym.plans.length >= 1) {
    for (let plan of gym.plans) {
      await Plan.findByIdAndDelete(plan._id);
    }
  }
  if (gym.images.length >= 1) {
    for (let image of gym.images) {
      await cloudinary.uploader.destroy(image.filename);
    }
  }
  req.flash("success", `${gym.name} has been deleted.`);
  res.redirect("/dashboard/gyms");
});
