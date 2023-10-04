const { validateGym, isLoggedIn, isAdmin } = require("../utilities/middleware/middleware.js");
const { storage } = require("../cloudinary");
const multer = require("multer");
const upload = multer({ storage });
const dash = require("../controller/dashboard.js");
const express = require("express");
const route = express.Router();

// RETRIEVE THE DASHBOARD
route.get("/", isLoggedIn, dash.getDashboard);

// DISPLAY ALL GYMS (DASHBOARD)
route.get("/gyms", isLoggedIn, dash.allGymsList);

// GET NEW GYM FORM
route.get("/gyms/new", isAdmin, dash.getNewGymForm);

// ADD NEW GYM
route.post("/gyms", isAdmin, upload.array("image"), validateGym, dash.createNewGym);

// GET EDIT FORM
route.get("/gyms/:id/edit", isLoggedIn, dash.getEditForm);
// UPDATE GYM
route.put("/gyms/:id", isLoggedIn, upload.array("image"), validateGym, dash.updateGym);

// DELETE GYM
route.delete("/:id", isAdmin, dash.deleteGym);

module.exports = route;
