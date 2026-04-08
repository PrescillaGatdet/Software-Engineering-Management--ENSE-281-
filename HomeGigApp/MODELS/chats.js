const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    gigId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Gigs',
        required: true 
    },

    customerEmail: { type: String }, 
    workerEmail: { type: String }, 
    status: { type: String, default: 'BARGAIN' },
    messages: [{
        sender: { type: String },
        text: { type: String },
        timestamp: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('Chat', chatSchema);