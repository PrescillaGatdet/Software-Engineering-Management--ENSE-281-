const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema({
    category: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    budget: { type: Number, required: true },
    // Empty string = On The Spot, Date present = Scheduled Ahead
    date_needed: { type: String, default: "" }, 
    status: { type: String, default: "open" }
});

module.exports = mongoose.model('Gigs', gigSchema);