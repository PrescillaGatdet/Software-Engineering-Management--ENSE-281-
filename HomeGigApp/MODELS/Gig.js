const mongoose = require("mongoose");

const gigSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  details: { type: String },
  address: { type: String, required: true },
  date: { type: Date, required: true },
  price: { type: Number, required: true },
  images: [String],
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["waiting", "bargaining", "confirmed", "completed"], default: "waiting" }
}, { timestamps: true });

module.exports = mongoose.model("Gig", gigSchema);