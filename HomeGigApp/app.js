const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose").default ||
                             require("passport-local-mongoose");
require("dotenv").config(); 

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/PUBLIC"));

mongoose.connect("mongodb://localhost:27017/HomeGigDB")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

console.log(process.env.DB_HOST)

app.use(session({
  secret: "superSecretKey",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["customer", "worker"], required: true }
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

const gigSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  details: { type: String },
  address: { type: String, required: true },
  date: { type: Date, required: true },
  price: { type: Number, required: true },
  images: [String],
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    enum: ["waiting", "bargaining", "confirmed", "completed"],
    default: "waiting"
  }
}, { timestamps: true });

const Gig = mongoose.model("Gig", gigSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

app.get("/", (req, res) => {
    res.render("index");
});

//Show Registeristration form
app.get("/register", (req, res) => res.render("register"));

//Handles new user registration
app.post("/register", async (req, res) => {
 const { email, password, role } = req.body;
const newUser = new User({
  username: email, 
  email,
  role
});
  try {
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      res.redirect("/dashboard");
    });
  } catch (err) {
    console.log(err);
    res.send("Error registering user");
  }
});

//Shows Login form
app.get("/login", (req, res) => res.render("login"));

//Authenticates users login
app.post("/login", passport.authenticate("local", {
  successRedirect: "/dashboard",
  failureRedirect: "/"
}));

// Dashboard
app.get("/dashboard", isLoggedIn, async (req, res) => {
  const gigs = await Gig.find({ customer: req.user._id });
  res.render("dashboard", { user: req.user, gigs });
});

// Show Post Gig form
app.get("/post-gig", isLoggedIn, (req, res) => {
  res.render("postGig");
});

// Handle Post Gig
app.post("/post-gig", isLoggedIn, async (req, res) => {
  const { title, description, details, address, date, price } = req.body;

  try {
    const newGig = new Gig({
      title,
      description,
      details,
      address,
      date,
      price,
      customer: req.user._id,
      status: "bargaining" // MVP default
    });

    await newGig.save();
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    res.send("Error posting gig");
  }
});

// Logout
app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/login");
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});