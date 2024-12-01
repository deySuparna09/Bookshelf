const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String },
});

const bookSchema = new mongoose.Schema({
  bookId: { type: String, required: true },
  title: { type: String, required: true },
  authors: { type: [String], required: true }, // Changed to an array to accommodate multiple authors
  thumbnail: { type: String },
  averageRating: { type: Number, default: 0 },
  reviews: [reviewSchema], // Embed user-specific reviews
  progress: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["not_started", "reading", "finished"],
    default: "not_started",
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User model
});

// Ensure unique books per user
bookSchema.index({ bookId: 1, user: 1 }, { unique: true });

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
