const { validateGym, isLoggedIn, isAdmin } = require("../utilities/middleware/middleware.js");
const express = require("express");
const route = express.Router();
const plan = require("../controller/plan.js");

// GET ALL PLANS FOR THIS GYM ROUTE
route.get("/:id/plans", isLoggedIn, plan.getGymPlans);

// GET NEW PLAN FORM ROUTE
route.get("/:id/plans/new", isAdmin, plan.getNewPlanForm);

// ADD PLAN TO GYM ROUTE
route.post("/:id/plans", isAdmin, plan.createNewPlan);

// DELETE PLAN FROM PLAN DB AND ASSOCIATED GYM ROUTE
route.delete("/:id/plans/:planID", isAdmin, plan.deletePlan);

module.exports = route;
