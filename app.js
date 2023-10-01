const express = require("express");
const app = express();
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utilities/ExpressError.js");
const gymRoutes = require("./routes/gyms.js");

// CONNECTING TO MONGODB
mongoose.connect("mongodb://127.0.0.1:27017/gym-finder", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database connection established!");
});

// SESSION OPTIONS
const sessionOptions = {
  name: "session",
  secret: "developmentSecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    expires: Date.now() * 1000 * 60 * 60 * 24 * 7,
  },
};

//MIDDLEWARES
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(session(sessionOptions));
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// ROUTES
app.use("/gyms", gymRoutes);
app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

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
