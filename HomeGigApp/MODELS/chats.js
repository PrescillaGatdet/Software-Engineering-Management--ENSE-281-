const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    gigId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Gig', 
        required: true 
    },
    customerEmail: { type: String, required: true },
    workerEmail: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['BARGAIN', 'CONFIRMED'], 
        default: 'CONFIRMED'
    },
    messages: [{
        sender: { type: String },
        text: { type: String },
        timestamp: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('Chat', chatSchema);