const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  authors: { type: [String], required: true }, // Changed to an array to accommodate multiple authors
  thumbnail: { type: String },
  rating: { type: Number, default: 0 },
  review: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
}, {
  timestamps: true, // Optional: adds createdAt and updatedAt fields
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
