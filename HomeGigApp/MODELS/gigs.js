const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema({
    category: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    budget: { type: Number, required: true },
    date_needed: { type: String, default: "" }, // Empty string = On The Spot, Date present = Scheduled Ahead
    
    // Status can be: OPEN (Red), BARGAIN (Yellow), CONFIRM (Green), COMPLETE (Purple)
    status: { type: String, default: "OPEN" },
    
    // Storing the live price agreed upon or being discussed in the bargain slot
    current_bargain_price: { type: Number, default: null },

    // The final price locked in after "Accept" or "Accept Bargain"
    negotiated_price: { type: Number, default: null },

    // Tracking if the worker has clicked "Gig Completed" in the chat
    worker_done: { type: Boolean, default: false },

    // Tracking if the customer has clicked "Confirm Completion" in the chat
    customer_done: { type: Boolean, default: false },

    // Tracking if both parties have clicked "Accept Bargain"
    worker_accepted_bargain: { type: Boolean, default: false },
    customer_accepted_bargain: { type: Boolean, default: false }
});

module.exports = mongoose.model('Gigs', gigSchema);