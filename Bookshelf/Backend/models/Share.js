const mongoose = require("mongoose");

const ShareSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bookId: { type: String, ref: "Book", required: true },
  rating: { type: Number, required: true },
  review: { type: String, required: true },
  progress: { type: Number, required: true }, // Percentage of book read
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Share", ShareSchema);
