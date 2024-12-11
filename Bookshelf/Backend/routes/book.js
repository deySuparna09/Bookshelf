const express = require("express");
const router = express.Router();
const {
  addBook,
  getBooks,
  updateBookProgress,
  getBooksByStatus,
  addOrUpdateReview,
  deleteReview,
  deleteBook,
} = require("../controllers/bookController");
const authMiddleware = require("../middleware/authMiddleware");

// Add a book
router.post("/", authMiddleware, addBook);

// Get all books for the authenticated user
router.get("/", authMiddleware, getBooks);

// Update progress or status of a book
router.put("/:bookId", authMiddleware, updateBookProgress);

// Get books by status (e.g., 'reading' or 'finished')
router.get("/status/:status", authMiddleware, getBooksByStatus);

// Add or update a review for a book
router.post("/:bookId/review", authMiddleware, addOrUpdateReview);

router.delete("/:bookId/review", authMiddleware, deleteReview);

router.delete("/:id", authMiddleware, deleteBook);

module.exports = router;
