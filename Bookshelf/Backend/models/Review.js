const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Referencing the user who wrote the review
    required: true,
  },
  bookId: {
    type: String, // Store the ID of the book (can be from a third-party API like Google Books)
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Users who liked this review
    },
  ],
});

module.exports = mongoose.model("Review", reviewSchema);
