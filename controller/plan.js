const Gym = require("../models/gym");
const Plan = require("../models/plan");
const catchAsync = require("../utilities/catchAsync.js");

// GET ALL GYM PLANS
module.exports.getGymPlans = catchAsync(async (req, res) => {
  const { id } = req.params;
  const gym = await Gym.findById(id).populate("plans");
  res.render("plan/plans-index.ejs", { gym });
});

// GET NEW PLAN FORM
module.exports.getNewPlanForm = catchAsync(async (req, res) => {
  const { id } = req.params;
  const gym = await Gym.findById(id);
  res.render("plan/plans-new.ejs", { gym });
});

// CREATE NEW PLAN, ASSIGN GYM REFERENCE TO PLAN AND PUSH NEW PLAN INTO GYM OBJECT
module.exports.createNewPlan = catchAsync(async (req, res) => {
  const { id } = req.params;
  const gym = await Gym.findById(id);
  const plan = new Plan(req.body.plan);
  plan.gym = id;
  gym.plans.push(plan);
  await plan.save();
  await gym.save();
  req.flash("success", `${plan.name} added to ${gym.name}!`);
  res.redirect(`/dashboard/gyms/${gym._id}/plans`);
});

// DELETE PLAN FOR PLANS DB AND FROM GYM ARRAY
module.exports.deletePlan = catchAsync(async (req, res) => {
  const { id, planID } = req.params;
  await Plan.findByIdAndDelete(planID);
  const gym = await Gym.findByIdAndUpdate(id, { $pull: { plans: planID } });
  req.flash("success", "Plan deleted!");
  res.redirect(`/dashboard/gyms/${gym._id}/plans`);
});
