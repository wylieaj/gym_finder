const { isAdmin } = require("../utilities/middleware/middleware.js");
const users = require("../controller/users.js");
const express = require("express");
const route = express.Router();

// USERS INDEX ROUTE
route.get("/", users.usersIndex);

// GET REGISTRATION FORM
route.get("/new", isAdmin, users.getRegisterForm);

// REGISTER NEW USER
route.post("/", isAdmin, users.registerUser);

// DELETE USER
route.delete("/:id", isAdmin, users.deleteUser);

module.exports = route;
