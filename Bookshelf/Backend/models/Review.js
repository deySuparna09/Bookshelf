const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    rating: { type: Number, required: true },
    review: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
