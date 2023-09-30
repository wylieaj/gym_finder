const express = require("express");
const app = express();
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const Gym = require("./models/gym");
const catchAsync = require("./utilities/catchAsync.js");
const { validateGym } = require("./utilities/middleware/middleware.js");

mongoose.connect("mongodb://127.0.0.1:27017/gym-finder", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database connection established!");
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));

// DISPLAY ALL GYMS
app.get(
  "/gyms",
  catchAsync(async (req, res) => {
    const allGyms = await Gym.find({});
    res.render("gyms/index.ejs", { allGyms });
  })
);

// RENDER NEW GYM FORM
app.get("/gyms/new", (req, res) => {
  res.render("gyms/new.ejs");
});

// SUBMIT NEW GYM
app.post(
  "/gyms",
  validateGym,
  catchAsync(async (req, res) => {
    const newGym = new Gym(req.body);
    await newGym.save();
    res.redirect(`/gyms/${newGym._id}`);
  })
);

// DISPLAY GYM BY ID
app.get(
  "/gyms/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const gym = await Gym.findById(id);
    res.render("gyms/show.ejs", { gym });
  })
);

// GET GYM UPDATE FORM
app.get(
  "/gyms/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const gym = await Gym.findById(id);
    res.render("gyms/edit.ejs", { gym });
  })
);

// UPDATE GYM
app.put(
  "/gyms/:id",
  validateGym,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const updatedGymData = req.body;
    const updatedGym = await Gym.findByIdAndUpdate(id, updatedGymData, { new: true });
    res.redirect(`/gyms/${id}`);
  })
);

// DELETE GYM
app.delete(
  "/gyms/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Gym.findByIdAndDelete(id);
    res.redirect("/gyms");
  })
);

// ERROR HANDLING
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = "OH NO, Something went wrong :(";
  }
  res.status(statusCode).render("error.ejs", { err });
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
