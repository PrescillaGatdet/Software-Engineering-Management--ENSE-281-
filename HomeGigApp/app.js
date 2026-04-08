const express = require("express");
const path = require("path");
const mongoose = require("mongoose"); 
const Gigs = require("./MODELS/gigs"); 
const Chat = require("./MODELS/chats");
const Amount = require("./MODELS/amounts");
const app = express();

// --- DATABASE CONNECTION ---
mongoose.connect("mongodb://127.0.0.1:27017/homegigs")
    .then(() => {
        console.log("Connected to MongoDB: HomeGigs...");
    })
    .catch((err) => {
        console.log("MongoDB Connection Error: ", err);
    });

// --- MIDDLEWARE FOR FORM DATA ---
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "VIEWS"));
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
        res.redirect("/dashboard-customer.html");
    } catch (err) {
        res.send("Error saving gig.");
    }
});

// --- EDIT GIG RENDER ROUTE ---
app.get("/edit-gig/:id", async (req, res) => {
    try {
        const gig = await Gigs.findById(req.params.id);
        if (!gig) return res.status(404).send("Gig not found");
        res.render("post-gig", { gig: gig, isEdit: true });
    } catch (err) {
        res.send("Error loading edit page.");
    }
});

// --- UPDATE GIG DATABASE ROUTE ---
app.post("/update-gig/:id", async (req, res) => {
    try {
        const { category, title, description, address, budget, date_needed } = req.body;
        await Gigs.findByIdAndUpdate(req.params.id, {
            category,
            title,
            description,
            address,
            budget,
            date_needed: date_needed || ""
        });
        res.redirect("/dashboard-customer.html");
    } catch (err) {
        res.send("Error updating gig.");
    }
});

// --- REMOVE GIG ROUTE ---
app.post("/remove-gig/:id", async (req, res) => {
    try {
        const gigId = req.params.id;
        await Gigs.findByIdAndDelete(gigId);
        await Chat.deleteMany({ gigId: gigId }); // Clean up associated chats
        console.log(`Gig ${gigId} and associated chats removed.`);
        res.redirect("/dashboard-customer.html");
    } catch (err) {
        console.log("Remove Error:", err);
        res.send("Error removing gig.");
    }
});

// --- DIRECT ACCEPT ROUTE---
app.post("/accept-gig/:id", async (req, res) => {
    try {
        const gigId = req.params.id;
        const updatedGig = await Gigs.findByIdAndUpdate(gigId, { 
            status: "CONFIRM" 
        }, { returnDocument: 'after' });
        res.redirect(`/view-chat/worker/${gigId}`);
    } catch (err) {
        res.send("Error accepting gig.");
    }
});

// --- BARGAIN GIG ROUTE---
app.post("/bargain-gig/:id", async (req, res) => {
    try {
        const gigId = req.params.id;
        await Gigs.findByIdAndUpdate(gigId, { 
            status: "BARGAIN" 
        });
        res.redirect(`/view-chat/worker/${gigId}`);
    } catch (err) {
        res.send("Error starting bargain.");
    }
});

// --- BARGAIN LOGIC ROUTES ---

// 1. Update Price (Syncs the input value)
app.post("/update-bargain-price/:id", async (req, res) => {
    try {
        const { price } = req.body;
        await Gigs.findByIdAndUpdate(req.params.id, { 
            current_bargain_price: price,
            worker_accepted_bargain: false,
            customer_accepted_bargain: false 
        });
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send("Error updating price.");
    }
});

// 2. Accept Bargain (Dual-lock logic)
app.post("/accept-bargain/:role/:id", async (req, res) => {
    try {
        const { role, id } = req.params;
        let updateData = {};
        
        if (role === 'worker') updateData.worker_accepted_bargain = true;
        if (role === 'customer') updateData.customer_accepted_bargain = true;

        let gig = await Gigs.findByIdAndUpdate(id, updateData, { returnDocument: 'after' });

        if (gig.worker_accepted_bargain && gig.customer_accepted_bargain) {
            gig.status = "CONFIRM";
            gig.negotiated_price = gig.current_bargain_price || gig.budget;
            await gig.save();
        }
        res.redirect(`/view-chat/${role}/${id}`);
    } catch (err) {
        res.send("Error accepting bargain.");
    }
});

// 3. Reject Bargain (The killswitch)
app.post("/reject-bargain/:role/:id", async (req, res) => {
    try {
        const { id, role } = req.params;

        await Gigs.findByIdAndUpdate(id, { 
            status: "OPEN",
            current_bargain_price: null,
            worker_accepted_bargain: false,
            customer_accepted_bargain: false
        });

        await Chat.deleteMany({ gigId: id }); // Clean up associated chats
        res.redirect(`/dashboard-${role}.html`);
    } catch (err) {
        res.send("Error rejecting bargain.");
    }
});

// --- COMPLETE GIG ROUTE ---
app.post("/complete-gig/:id", async (req, res) => {
    try {
        const gigId = req.params.id;
        const gig = await Gigs.findById(gigId);
        
        if (gig) {
            const earningRecord = new Amount({
                title: gig.title,
                category: gig.category,
                address: gig.address,
                budget: gig.negotiated_price || gig.budget
            });
            await earningRecord.save();

            await Gigs.findByIdAndUpdate(gigId, { 
                status: "COMPLETE",
                worker_done: true 
            });

            res.redirect(`/view-chat/worker/${gigId}`);
        } else {
            res.status(404).send("Gig not found.");
        }
    } catch (err) {
        res.send("Error completing gig.");
    }
});

// --- VIEW SPECIFIC CHAT ---
app.get("/view-chat/:role/:id", async (req, res) => {
    try {
        const { role, id } = req.params;
        const gig = await Gigs.findById(id);
        if (!gig) return res.status(404).send("Gig not found.");
        res.render("chat-view", { gig: gig, role: role });
    } catch (err) {
        res.send("Error loading the chat.");
    }
});

// Automated Routing
const pages = [
    "index", "login", "register", "dashboard-customer", "dashboard-worker",
    "chats-customer", "chats-worker", "post-gig", "earnings", 
    "account-customer", "account-worker",
    "assembling", "leaves-raking", "moving", "painting", "plumbing", "snow-blowing", "windows-cleaning"
];

pages.forEach(page => {
    app.get([`/${page}`, `/${page}.html`], async (req, res) => {
        const categoryPages = ["assembling", "leaves-raking", "moving", "painting", "plumbing", "snow-blowing", "windows-cleaning"];

        if (page === "dashboard-customer" || page === "chats-customer") {
            try {
                const allGigs = await Gigs.find();
                res.render(page, { gigs: allGigs });
            } catch (err) {
                res.render(page, { gigs: [] });
            }
        } 
        else if (page === "dashboard-worker" || categoryPages.includes(page)) {
            try {
                const availableGigs = await Gigs.find({ 
                    status: { $in: ["OPEN", "BARGAIN"] } 
                }); 
                res.render(page, { gigs: availableGigs });
            } catch (err) {
                res.render(page, { gigs: [] });
            }
        }
        else if (page === "chats-worker") {
            try {
                const allGigs = await Gigs.find();
                res.render(page, { gigs: allGigs });
            } catch (err) {
                res.render(page, { gigs: [] });
            }
        }
        else if (page === "earnings") {
            try {
                // Experimental: Uncomment the line below, restart server, and refresh browser to delete all earnings.
                // await Amount.deleteMany({}); 

                const earningsHistory = await Amount.find().sort({ dateCompleted: -1 });
                res.render(page, { gigs: earningsHistory });
            } catch (err) {
                res.render(page, { gigs: [] });
            }
        }
        else {
            res.render(page, { gig: {}, isEdit: false });
        }
    });
});

app.get("/", (req, res) => { res.render("index"); });

app.listen(3000, () => {
    console.log(`Server is running at http://localhost:3000`);
});