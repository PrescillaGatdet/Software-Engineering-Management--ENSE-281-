const express = require("express");
const path = require("path");
const mongoose = require("mongoose"); 
const Gigs = require("./MODELS/gigs"); 
const app = express();

// --- DATABASE CONNECTION ---
mongoose.connect("mongodb://127.0.0.1:27017/homegigs")
    .then(() => {
        console.log("Connected to MongoDB: HomeGigs...");
    })
    .catch((err) => {
        console.log("MongoDB Connection Error: ", err);
    });

// --- THE "NUKE" COMMAND (Experimental Reset) ---
/*
async function nukeGigs() {
    await Gigs.deleteMany({});
    console.log("Database Cleared: All experimental gigs removed.");
}
nukeGigs();
*/

// --- MIDDLEWARE FOR FORM DATA ---
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 1. Set the view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "VIEWS"));

// 2. Serve your static assets
app.use(express.static(path.join(__dirname, "PUBLIC")));

// --- LOGIC TO SAVE POSTED GIGS ---
app.post("/post-gig", async (req, res) => {
    try {
        const newGig = new Gigs({
            category: req.body.category,
            title: req.body.title,
            description: req.body.description,
            address: req.body.address,
            budget: req.body.budget,
            date_needed: req.body.date_needed || "" 
        });
        await newGig.save();
        console.log("Gig Saved Successfully!");
        res.redirect("/dashboard-customer.html");
    } catch (err) {
        console.log("Save Error Details:", err);
        res.send("Error saving gig.");
    }
});

// 3. Automated Routing
const pages = [
    "index", "login", "register", "dashboard-customer", "dashboard-worker",
    "chats-customer", "chats-worker", "post-gig", "earnings", 
    "account-customer", "account-worker"
];

pages.forEach(page => {
    app.get([`/${page}`, `/${page}.html`], async (req, res) => {
        if (page === "dashboard-customer") {
            try {
                const allGigs = await Gigs.find();
                res.render("dashboard-customer", { gigs: allGigs });
            } catch (err) {
                res.render("dashboard-customer", { gigs: [] });
            }
        } 
        else if (page === "dashboard-worker") {
            try {
                // Fetching gigs for the worker dashboard
                const allGigs = await Gigs.find();
                res.render("dashboard-worker", { gigs: allGigs });
            } catch (err) {
                res.render("dashboard-worker", { gigs: [] });
            }
        }
        else {
            res.render(page);
        }
    });
});

// Root route
app.get("/", (req, res) => {
    res.render("index");
});

// 4. Start the server on port 3000
app.listen(3000, () => {
    console.log(`Server is running at http://localhost:3000`);
});