import { useState, useEffect, useContext } from "react";
import { useAuth } from "./useAuth"; // Ensure this import path is correct
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "./Modal";
import { ThemeContext } from "./ThemeContext";

const Bookshelf = () => {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { user } = useAuth(); // Get current authenticated user
  const navigate = useNavigate();
  // Fetch books whenever the user is available
  const { theme } = useContext(ThemeContext); 

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [shareLink, setShareLink] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/book", {
          headers: { Authorization: `Bearer ${token}` }, // Send token for user-specific books
        });
        setBooks(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    // Call fetchBooks only if the user is authenticated
    if (user) {
      fetchBooks();
    }
  }, [user]);

  const handleSearch = async () => {
    try {
      const res = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${
          import.meta.env.VITE_GOOGLE_BOOKS_API_KEY
        }`
      );

      setSearchResults(res.data.items || []);
    } catch (error) {
      console.error("Error searching for books:", error);
    }
  };

  const addToBookshelf = async (book) => {
    try {
      // Check if the book already exists in the user's bookshelf
      const isBookInBookshelf = books.some((b) => b.bookId === book.id);

      if (isBookInBookshelf) {
        alert("This book is already in your bookshelf!");
        return; // Exit early to avoid duplicate addition
      }

      const bookData = {
        bookId: book.id,
        title: book.volumeInfo.title,
        authors: book.volumeInfo.authors || [], // Ensure authors is an array
        thumbnail: book.volumeInfo.imageLinks?.thumbnail || "",
        rating: book.rating,
        review: book.review || "",
        progress: book.progress || 0,
        status: book.status || "not_started",
      };

      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/book",
        bookData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update the state with the new book (immediate update without refresh)
      setBooks((prevBooks) => [...prevBooks, response.data]);
      alert("Book added to your bookshelf!");
    } catch (error) {
      console.error("Error adding book:", error.response || error);
    }
  };

  // Handle Review Submission
  const handleRatingChange = (bookId, rating) => {
    setBooks((prevBooks) =>
      prevBooks.map((b) =>
        b.bookId === bookId ? { ...b, userRating: Number(rating) } : b
      )
    );
  };

  const handleReviewChange = (bookId, review) => {
    setBooks((prevBooks) =>
      prevBooks.map((b) =>
        b.bookId === bookId ? { ...b, userReview: review } : b
      )
    );
  };

  const submitReview = async (bookId) => {
    const book = books.find((b) => b.bookId === bookId);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:5000/api/book/${bookId}/review`,
        {
          rating: book.userRating,
          review: book.userReview,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update the local state with the new review
      setBooks((prevBooks) =>
        prevBooks.map((b) => (b.bookId === bookId ? res.data : b))
      );
      alert("Review submitted!");
    } catch (error) {
      console.error("Error submitting review:", error.response || error);
    }
  };

  const deleteReview = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/book/${bookId}/review`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBooks((prevBooks) =>
        prevBooks.map((b) =>
          b.bookId === bookId ? { ...b, reviews: [], averageRating: 0 } : b
        )
      );
      alert("Review deleted!");
    } catch (error) {
      console.error("Error deleting review:", error.response || error);
    }
  };

  const handleShare = (book) => {
    setCurrentBook(book);
    setShareModalOpen(true);
  };

  const createShareLink = async ({ rating, review, progress  }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/share",
        {
          userId: user._id,
          bookId: currentBook.bookId,
          rating,
          review,
          progress,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Share request data:", {
        userId: user._id,
        bookId: currentBook.bookId,
        rating,
        review,
        progress,
      });

      if (response.status === 201) {
        const { shareLink: generatedLink } = response.data;
        setShareLink(`${window.location.origin}${generatedLink}`);
        alert("Share link generated!");
      } else {
        alert("Failed to generate share link. Try again!");
      }
    } catch (error) {
      console.error("Error creating share link:", error.response || error);
      alert("An error occurred while generating the share link.");
    } finally {
      setShareModalOpen(false);
    }
  };

  const handleLogout = () => {
    // Clear tokens from localStorage or sessionStorage
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");

    // Redirect to login page
    navigate("/login");
  };

  // If the user is not authenticated, redirect to the login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <div
      className={`text-center items-center justify-center min-h-screen ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
      }`}
    >
        <h1 className="font-bold text-xl">My Bookshelf</h1>

        {/* Search for books */}
        <div>
          <input
            id="text"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for books..."
            className="input w-80 py-1 px-3 border rounded-md outline-none dark:text-black"
          />
          <button
            onClick={handleSearch}
            className="px-2 py-2 bg-black text-white mt-6 rounded-md hover:bg-slate-800 duration-300 cursor-pointer"
          >
            Search
          </button>
        </div>

        {/* Display search results */}
        {searchResults && searchResults.length > 0 && (
          <div>
            <h3 className="font-bold text-xl mt-6">Search Results</h3>
            <div className="flex overflow-x-auto space-x-4 py-4 scrollbar-hide">
              {searchResults.map((book) => (
                <div
                  key={book.id}
                  className="flex-shrink-0 w-60 p-4 bg-white border rounded shadow-lg"
                >
                  <img
                    src={
                      book.volumeInfo.imageLinks?.thumbnail ||
                      "https://via.placeholder.com/128x194?text=No+Image"
                    }
                    alt={book.volumeInfo.title}
                    className="w-full h-40 object-contain rounded bg-gray-100"
                  />
                  <h3 className="font-semibold mt-2 dark:text-black">
                    {book.volumeInfo.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {book.volumeInfo.authors?.join(", ") || "Unknown Author"}
                  </p>
                  <button
                    onClick={() => addToBookshelf(book)}
                    className="px-2 py-2 bg-black text-white mt-3 rounded-md hover:bg-gray-800 duration-300 cursor-pointer"
                  >
                    Want to Read
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <h1 className="font-bold text-xl mt-6">Books in My Collection</h1>
        {/* Display books in the bookshelf */}
        <div className="flex overflow-x-auto space-x-4 py-4 scrollbar-hide">
          {books.length > 0 ? (
            books.map((book) => (
              <div
                key={book._id}
                className="flex-shrink-0 w-60 p-4 bg-white border rounded shadow-lg"
              >
                <img
                  src={book.thumbnail}
                  alt={book.title}
                  className="w-full h-40 object-contain rounded bg-gray-100"
                />
                <h3 className="font-bold dark:text-black">{book.title}</h3>
                <p className="text-sm text-gray-600 dark:text-black">Authors: {book.authors?.join(", ")}</p>
                {/* Display Average Rating */}
                <p className="text-sm text-gray-600 dark:text-black">Average Rating: {book.averageRating.toFixed(1)}</p>
                {/* User Review Form */}
                <div>
                  <label className="dark:text-black">Rate this book: </label>
                  <select className="dark:text-black"
                    value={book.userRating || ""}
                    onChange={(e) =>
                      handleRatingChange(book.bookId, e.target.value)
                    }
                  >
                    <option value="">Select</option>
                    {[1, 2, 3, 4, 5].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>

                  <textarea className="dark:text-black"
                    placeholder="Write a review..."
                    value={book.userReview || ""}
                    onChange={(e) =>
                      handleReviewChange(book.bookId, e.target.value)
                    }
                  ></textarea>

                  <button
                    className="logout-button px-2 py-2 bg-slate-700 text-white mt-3 mr-4 rounded-md hover:bg-slate-800 duration-300 cursor-pointer"
                    onClick={() => submitReview(book.bookId)}
                  >
                    Submit
                  </button>
                  <button
                    className="logout-button px-2 py-2 bg-slate-700 text-white mt-3 rounded-md hover:bg-slate-800 duration-300 cursor-pointer"
                    onClick={() => deleteReview(book.bookId)}
                  >
                    Delete Review
                  </button>
                  <button
                    className="logout-button px-2 py-2 bg-slate-700 text-white mt-3 rounded-md hover:bg-slate-800 duration-300 cursor-pointer"
                    onClick={() => handleShare(book)}
                  >
                    Share
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No books in your bookshelf yet.</p>
          )}
        </div>
        {shareModalOpen && (
          <Modal
            isOpen={shareModalOpen}
            onClose={() => setShareModalOpen(false)}
          >
            <h2 className="text-xl font-semibold mb-4 dark:text-black">Share {currentBook.title}</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault(); // Prevent form reload
                console.log("Current Book:", currentBook);
                createShareLink({
                  rating: currentBook.rating,
                  review: currentBook.review,
                  progress: currentBook.progress,
                });
              }}
            >
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Generate Link</button>
            </form>
          </Modal>
        )}

        {shareLink && (
          <div className="mt-4">
            <p>Shareable Link:</p>
            <a
              href={shareLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {shareLink}
            </a>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="logout-button px-2 py-2 bg-black text-white mt-3 rounded-md hover:bg-slate-800 duration-300 cursor-pointer"
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default Bookshelf;