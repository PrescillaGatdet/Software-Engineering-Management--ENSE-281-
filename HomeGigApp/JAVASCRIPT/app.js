const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const User = require("./models/User");
const Gig = require("./models/Gig");

const passportLocalMongoose = require("passport-local-mongoose");
const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/HomeGigDB")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// EJS & body parser
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// Session & Passport
app.use(session({
  secret: "superSecretKey",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to check login
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}