if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utilities/ExpressError.js");
const passport = require("passport");
const passportLocal = require("passport-local");
const gymRoutes = require("./routes/gyms.js");
const authRoutes = require("./routes/auth.js");
const dashboardRoutes = require("./routes/dashboard.js");
const planRoutes = require("./routes/plan.js");
const usersRoutes = require("./routes/users.js");
const User = require("./models/user.js");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const MongoStore = require("connect-mongo")(session);

// CONNECTING TO MONGODB

const dbUrl = process.env.DBURL || "mongodb://127.0.0.1:27017/gym-finder";
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(dbUrl);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database connection established!");
});

// MONGOSTORE
const secret = process.env.SESSION_SECRET;
const store = new MongoStore({
  url: dbUrl,
  secret,
  touchAfter: 24 * 3600,
});
store.on("error", function (err) {
  console.log(err);
});

// SETUP
// SESSION OPTIONS
const sessionOptions = {
  store,
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    expires: Date.now() * 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionOptions));

// EJS
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

// FORMS SETUP
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(mongoSanitize());

// HELMET
app.use(helmet());
const scriptSrcUrls = ["https://unpkg.com/", "https://cdn.jsdelivr.net/", "https://kit.fontawesome.com/", "https://cdnjs.cloudflare.com/"];
const styleSrcUrls = [, "https://unpkg.com/", "https://cdn.jsdelivr.net/", "https://kit-free.fontawesome.com/", "https://fonts.googleapis.com/", "https://use.fontawesome.com/"];
const connectSrcUrls = ["https://unpkg.com/", "https://res.cloudinary.com/", "https://events.mapbox.com/"];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/dskmlqboo/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
        "https://images.unsplash.com/",
        "https://unpkg.com/",
        "https://a.tile.openstreetmap.org/",
        "https://b.tile.openstreetmap.org/",
        "https://c.tile.openstreetmap.org/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

// FLASH
app.use(flash());

// PASSPORT
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// FLASH & CURRENT USER
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// ROUTES
app.get("/", (req, res) => {
  res.render("home.ejs");
});
app.use("/", authRoutes);
app.use("/gyms", gymRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/dashboard/gyms", planRoutes);
app.use("/dashboard/users", usersRoutes);
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

// LISTENING PORT
if (process.env.NODE_ENV !== "production") {
  port = 3000;
} else {
  port = process.env.PORT;
}
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
