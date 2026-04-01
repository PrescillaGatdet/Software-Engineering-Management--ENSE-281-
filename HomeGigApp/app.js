const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose").default ||
  require("passport-local-mongoose");
require("dotenv").config();

//module to upload images
const multer = require("multer");
const upload = multer({ dest: "PUBLIC/IMAGES/" }); 

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
  category: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  details: { type: String },
  address: { type: String, required: true },
  date: { type: Date, required: true },
  budget: { type: Number, required: true },
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
      if (registeredUser.role === "customer") {
        res.redirect("/dashboard-customer");
      } else if (registeredUser.role === "worker") {
        res.redirect("/dashboard-worker");
      }
    });
  } catch (err) {
    console.log(err);
    res.send("Error registering user");
  }
});

//Shows Login form
app.get("/login", (req, res) => res.render("login"));

//Authenticates users login
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.redirect("/login");

    req.logIn(user, (err) => {
      if (err) return next(err);

      // Redirect based on role
      if (user.role === "customer") {
        return res.redirect("/dashboard-customer");
      } else if (user.role === "worker") {
        return res.redirect("/dashboard-worker");
      } else {
        return res.redirect("/");
      }
    });
  })(req, res, next);
});

// Dashboard
app.get("/dashboard-customer", isLoggedIn, async (req, res) => {
  const gigs = await Gig.find({ customer: req.user._id });
  res.render("dashboard-customer", { user: req.user, gigs });
});

app.get("/dashboard-worker", isLoggedIn, async (req, res) => {
  const gigs = await Gig.find();
  res.render("dashboard-worker", { user: req.user, gigs });
});

// Show Post Gig form
app.get("/post-gig", isLoggedIn, (req, res) => {
  if (req.user.role === "customer") {
    res.render("post-gig", { user: req.user });
  } else if (req.user.role === "worker") {
    res.redirect("/dashboard-worker");
  }
});

// Handle Post Gig
app.post("/post-gig", isLoggedIn, upload.array("gig_images", 5), async (req, res) => {
  const { title, description, category, address, date, budget } = req.body;
  const images = req.files.map(file => file.filename); // or file.path

  try {
    const newGig = new Gig({
      title,
      description,
      category,
      address,
      date,
      budget,
      images,
      customer: req.user._id,
      status: "waiting"
    });

    await newGig.save();
    res.redirect("/dashboard-customer");
  } catch (err) {
    console.log(err);
    res.send("Error posting gig");
  }
});

app.get("/chats-customer", isLoggedIn, (req, res) => {
  if (req.user.role === "customer") {
    res.render("chats-customer", { user: req.user });
  } else {
    res.redirect("/dashboard-worker");
  }
});

app.get("/chats-worker", isLoggedIn, (req, res) => {
  if (req.user.role === "worker") {
    res.render("chats-worker", { user: req.user });
  } else {
    res.redirect("/dashboard-customer");
  }
});

app.get("/account-customer", isLoggedIn, (req, res) => {
  if (req.user.role === "customer") {
    res.render("account-customer", { user: req.user });
  } else {
    res.redirect("/dashboard-worker");
  }
});

app.get("/account-worker", isLoggedIn, (req, res) => {
  if (req.user.role === "worker") {
    res.render("account-worker", { user: req.user });
  } else {
    res.redirect("/dashboard-customer");
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