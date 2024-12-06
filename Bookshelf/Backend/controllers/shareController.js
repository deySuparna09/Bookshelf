const Share = require("../models/Share");
const Book = require("../models/Book");

// Create a shareable entry
const createShare = async (req, res) => {
  console.log("Request received at /api/share");
  const { userId, bookId, rating, review, progress } = req.body;

  try {
    const book = await Book.findOne({ bookId });
    if (!userId || !bookId || !rating || !review || !progress) {
      console.log("Missing fields in request body:", req.body);
      return res.status(400).json({ message: "All fields are required" });
    }

    const sharedEntry = new Share({
      userId,
      bookId: book.bookId,
      rating,
      review,
      progress,
    });
    await sharedEntry.save();

    res.status(201).json({
      message: "Book shared successfully!",
      shareLink: `/share/${bookId}`,
    });
  } catch (error) {
    console.error("Error in createShare:", error.message, error.stack);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Fetch shared book details
const getSharedBook = async (req, res) => {
  const { shareId } = req.params;

  try {
    const sharedEntry = await Share.findById(shareId)
      .populate("userId")
      .populate("bookId");
    if (!sharedEntry)
      return res.status(404).json({ message: "Share not found" });

    res.status(200).json(sharedEntry);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createShare,
  getSharedBook,
};
