const mongoose = require('mongoose');

const amountSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    address: { type: String, required: true },
    budget: { type: Number, required: true },
    dateCompleted: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Amount', amountSchema);