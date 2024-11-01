const Book = require('../models/Book');

// Add a book to the user's bookshelf
const addBook = async (req, res) => {
  const { title, author, thumbnail, rating, review } = req.body;
  try {
    const book = new Book({
      title,
      author,
      thumbnail,
      rating,
      review,
      user: req.user.id,
    });

    await book.save();
    res.status(201).json(book);
  } catch (error) {
    console.error('Error in addBook:', error); 
    res.status(500).json({ message: 'Error adding book' });
  }
};

// Get all books for the authenticated user
const getBooks = async (req, res) => {
  try {
    const books = await Book.find({ user: req.user.id });
    res.json(books);
  } catch (error) {
    console.error('Error in getBooks:', error);
    res.status(500).json({ message: 'Error fetching books' });
  }
};

module.exports = { addBook, getBooks };