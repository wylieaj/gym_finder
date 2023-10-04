const express = require("express");
const gyms = require("../controller/gyms.js");
const route = express.Router();

// DISPLAY ALL GYMS
route.get("/", gyms.displayAllGyms);

// DISPLAY GYM BY ID
route.get("/:id", gyms.displayGym);

module.exports = route;
