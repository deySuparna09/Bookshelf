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
      rating,
      review,
      progress,
      status,
      user: req.user.id,
    });

    await book.save();
    res.status(201).json(book);
  } catch (error) {
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

module.exports = { addBook, getBooks, updateBookProgress, getBooksByStatus };
