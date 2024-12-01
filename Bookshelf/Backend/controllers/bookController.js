const Book = require("../models/Book");

// Add a book to the user's bookshelf
const addBook = async (req, res) => {
  const {
    bookId,
    title,
    authors,
    thumbnail,
    rating,
    review,
    progress,
    status,
  } = req.body;

  if (!bookId || !title || !authors) {
    return res
      .status(400)
      .json({ message: "bookId, title, and authors are required." });
  }

  try {
    const existingBook = await Book.findOne({ bookId, user: req.user.id });
    if (existingBook) {
      return res
        .status(400)
        .json({ message: "This book is already in your bookshelf." });
    }

    // Check if the book already exists globally in the database
    const globalBook = await Book.findOne({ bookId });

    // Use the global book's rating if it exists, or default to the provided rating
    const finalRating = globalBook ? globalBook.rating : rating || 0;

    const book = new Book({
      bookId,
      title,
      authors,
      thumbnail,
      rating: finalRating,
      review,
      progress,
      status,
      user: req.user.id,
    });

    await book.save();
    res.status(201).json(book);
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "This book is already in your bookshelf." });
    }
    console.error("Error in addBook:", error);
    res.status(500).json({ message: "Error adding book" });
  }
};

// Get all books for the authenticated user
const getBooks = async (req, res) => {
  try {
    const books = await Book.find({ user: req.user.id });
    res.json(books);
  } catch (error) {
    console.error("Error in getBooks:", error);
    res.status(500).json({ message: "Error fetching books" });
  }
};

//Update progress or status of a book
const updateBookProgress = async (req, res) => {
  const { bookId } = req.params;
  console.log("Book ID received:", bookId); // Log the bookId
  console.log("Update Data:", req.body); // Log the data sent from the frontend
  const { progress, status } = req.body;

  try {
    const updatedBook = await Book.findOneAndUpdate(
      { _id: bookId, user: req.user.id }, // Ensure the book belongs to the user
      { progress, status },
      { new: true } // Return the updated document
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(updatedBook);
  } catch (error) {
    console.error("Error in updateBookProgress:", error);
    res.status(500).json({ message: "Error updating book progress" });
  }
};

//Get books by status
const getBooksByStatus = async (req, res) => {
  const { status } = req.params;

  try {
    const books = await Book.find({ user: req.user.id, status });
    res.json(books);
  } catch (error) {
    console.error("Error in getBooksByStatus:", error);
    res.status(500).json({ message: "Error fetching books by status" });
  }
};

//Add or Update a Review
const addOrUpdateReview = async (req, res) => {
  const { bookId } = req.params;
  const { rating, review } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5." });
  }

  try {
    const book = await Book.findOne({ bookId, user: req.user.id });

    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }

    const existingReviewIndex = book.reviews.findIndex(
      (r) => r.user.toString() === req.user.id
    );

    if (existingReviewIndex >= 0) {
      // Update the existing review
      book.reviews[existingReviewIndex].rating = rating;
      book.reviews[existingReviewIndex].review = review;
    } else {
      // Add a new review
      book.reviews.push({ user: req.user.id, rating, review });
    }

    // Recalculate average rating
    book.averageRating =
      book.reviews.reduce((sum, r) => sum + r.rating, 0) / book.reviews.length;

    console.log(book.averageRating);

    await book.save();
    res.json(book);
  } catch (error) {
    console.error("Error in addOrUpdateReview:", error);
    res.status(500).json({ message: "Error adding/updating review." });
  }
};

//Delete a Review
const deleteReview = async (req, res) => {
  const { bookId } = req.params;

  try {
    const book = await Book.findOne({ bookId, user: req.user.id });

    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }

    // Remove the user's review
    book.reviews = book.reviews.filter(
      (r) => r.user.toString() !== req.user.id
    );

    // Recalculate average rating
    book.averageRating =
      book.reviews.length > 0
        ? book.reviews.reduce((sum, r) => sum + r.rating, 0) /
          book.reviews.length
        : 0;

    await book.save();
    res.json(book);
  } catch (error) {
    console.error("Error in deleteReview:", error);
    res.status(500).json({ message: "Error deleting review." });
  }
};

module.exports = {
  addBook,
  getBooks,
  updateBookProgress,
  getBooksByStatus,
  addOrUpdateReview,
  deleteReview,
};
