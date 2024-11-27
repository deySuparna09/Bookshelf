const express = require("express");
const {
  addBook,
  getBooks,
  updateBookProgress,
  getBooksByStatus,
} = require("../controllers/bookController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Add a book
router.post("/", authMiddleware, addBook);

// Get all books for the authenticated user
router.get("/", authMiddleware, getBooks);

// Update progress or status of a book
router.put("/:bookId", authMiddleware, updateBookProgress);

// Get books by status (e.g., 'reading' or 'finished')
router.get("/status/:status", authMiddleware, getBooksByStatus);

module.exports = router;
