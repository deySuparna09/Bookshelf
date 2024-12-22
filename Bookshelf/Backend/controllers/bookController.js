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

    const book = new Book({
      bookId,
      title,
      authors,
      thumbnail,
      averageRating: rating || 0,
      reviews: review ? [{ user: req.user.id, rating, review }] : [],
      progress,
      status,
      user: req.user.id,
    });

    await book.save();
    const newAverageRating = await recalculateAverageRating(bookId);
    res
      .status(201)
      .json({ ...book.toObject(), averageRating: newAverageRating });
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

const getBooks = async (req, res) => {
  try {
    const books = await Book.find({ user: req.user.id }).lean();

    const booksWithUserReview = books.map((book) => {
      // Find all reviews by the current user
      const userReviews = book.reviews.filter(
        (review) => review.user.toString() === req.user.id.toString()
      );
      // Get the last review if it exists
      const lastUserReview =
        userReviews.length > 0 ? userReviews[userReviews.length - 1] : null;
      return {
        ...book,
        userReview: lastUserReview ? lastUserReview.review : null,
        userRating: lastUserReview ? lastUserReview.rating : null,
      };
    });

    res.json(booksWithUserReview);
  } catch (error) {
    console.error("Error in getBooks:", error);
    res.status(500).json({ message: "Error fetching books" });
  }
};

// Controller to delete a book
const deleteBook = async (req, res) => {
  const bookId = req.params.id; // Get book ID from the route parameter
  const userId = req.user.id; // Assuming `req.user` contains the authenticated user info

  try {
    // Find the book in the database
    const book = await Book.findOne({ _id: bookId, user: userId });

    if (!book) {
      return res
        .status(404)
        .json({ message: "Book not found in your bookshelf." });
    }

    // Remove the book
    await Book.deleteOne({ _id: bookId, user: userId });

    return res.status(200).json({ message: "Book removed successfully." });
  } catch (error) {
    console.error("Error removing book:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while removing the book." });
  }
};

//Update progress or status of a book
const updateBookProgress = async (req, res) => {
  const { bookId } = req.params;
  //console.log("Book ID received:", bookId); // Log the bookId
  //console.log("Update Data:", req.body); // Log the data sent from the frontend
  const { progress, status } = req.body;

  try {
    const updatedBook = await Book.findOneAndUpdate(
      { bookId, user: req.user.id }, // Ensure the book belongs to the user
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
    const books = await Book.find({ user: req.user.id, status }).select(
      "bookId title authors thumbnail progress status"
    );
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

    await book.save();
    const newAverageRating = await recalculateAverageRating(bookId);
    res.status(201).json({
      ...book.toObject(),
      review: book.reviews,
      averageRating: newAverageRating,
    });
  } catch (error) {
    console.error("Error in addOrUpdateReview:", error);
    res.status(500).json({ message: "Error adding/updating review." });
  }
};

const recalculateAverageRating = async (bookId) => {
  try {
    const books = await Book.find({ bookId });
    if (books.length === 0) return;
    const totalRatings = books.reduce((sum, book) => {
      const bookRatingSum = book.reviews.reduce(
        (reviewSum, review) => reviewSum + review.rating,
        0
      );
      return sum + bookRatingSum;
    }, 0);
    const totalReviews = books.reduce(
      (count, book) => count + book.reviews.length,
      0
    );
    const newAverageRating = totalReviews > 0 ? totalRatings / totalReviews : 0;
    await Book.updateMany({ bookId }, { averageRating: newAverageRating });
    return newAverageRating;
  } catch (error) {
    console.error("Error in recalculateAverageRating:", error);
  }
};

//Delete a Review
const deleteReview = async (req, res) => {
  const { bookId } = req.params;
  const userId = req.user.id;

  try {
    const book = await Book.findOneAndUpdate(
      { bookId, "reviews.user": userId },
      { $pull: { reviews: { user: userId } } },
      { new: true }
    );

    if (!book) {
      console.error(
        `Book not found for bookId: ${bookId} and userId: ${userId}`
      );
      return res.status(404).json({ message: "Book not found." });
    }

    await book.save();
    const newAverageRating = await recalculateAverageRating(bookId);
    res
      .status(201)
      .json({ ...book.toObject(), averageRating: newAverageRating });
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
  deleteBook,
};
