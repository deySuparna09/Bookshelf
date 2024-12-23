import { useState, useEffect, useContext } from "react";
import { useAuth } from "./useAuth"; // Ensure this import path is correct
import { Navigate} from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import axios from "axios";
import { ThemeContext } from "./ThemeContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Bookshelf = () => {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { user } = useAuth(); // Get current authenticated user
  const { theme } = useContext(ThemeContext);
  useEffect(() => {
    let isMounted = true; // Flag to track component mounting
  
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axiosInstance.get("/api/book", {
          headers: { Authorization: `Bearer ${token}` }, // Send token for user-specific books
        });
        if (isMounted) {
          setBooks(Array.isArray(res.data) ? res.data : []);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
  
    // Call fetchBooks only if the user is authenticated
    if (user && isMounted) {
      fetchBooks();
    }
  
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${
          import.meta.env.VITE_GOOGLE_BOOKS_API_KEY
        }`
      );
      setSearchResults(response.data.items);
    } catch (error) {
      console.error("Error fetching book data:", error);
    }
  };

  const addToBookshelf = async (book) => {
    try {
      // Check if the book already exists in the user's bookshelf
      const isBookInBookshelf = books.some((b) => b.bookId === book.id);

      if (isBookInBookshelf) {
        toast.warn("This book is already in your bookshelf!");
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
      const response = await axiosInstance.post("/api/book", bookData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update the state with the new book (immediate update without refresh)
      setBooks((prevBooks) => [...prevBooks, response.data]);
      toast.success("Book added to your bookshelf!");
    } catch (error) {
      console.error("Error adding book:", error.response || error);
    }
  };

  const removeFromBookshelf = async (bookId) => {
    try {
      const token = localStorage.getItem("token");

      // Call the backend to remove the book
      await axiosInstance.delete(`/api/book/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update the state to reflect the removal
      setBooks((prevBooks) => prevBooks.filter((book) => book._id !== bookId));
      toast.success("Book removed successfully!");
    } catch (error) {
      console.error("Error removing book:", error.response || error);
      toast.error("Failed to remove the book.");
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
      const res = await axiosInstance.post(
        `/api/book/${bookId}/review`,
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
        prevBooks.map((b) =>
          b.bookId === bookId
            ? {
                ...b,
                reviews: res.data.review, // Updated reviews
                averageRating: res.data.averageRating, // Updated average rating
              }
            : b
        )
      );
      toast.success("Rating & Review submitted!");
    } catch (error) {
      console.error("Error submitting review:", error.response || error);
    }
  };

  const deleteReview = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.delete(
        `/api/book/${bookId}/review`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedBook = response.data;
      setBooks((prevBooks) =>
        prevBooks.map((b) =>
          b.bookId === bookId
            ? {
                ...b,
                reviews: updatedBook.reviews,
                averageRating: updatedBook.averageRating,
                userRating: "", // Clear the rating input
                userReview: "", // Clear the review input
              }
            : b
        )
      );
      toast.success("Rating & Review deleted!");
    } catch (error) {
      console.error("Error deleting review:", error.response || error);
    }
  };

  // If the user is not authenticated, redirect to the login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <ToastContainer />
      <div
        className={`text-center items-center justify-center min-h-screen ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
        }`}
      >
        <h1 className="font-bold text-3xl">My Bookshelf</h1>

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
            className="px-2 py-2 ml-2 bg-black text-white mt-6 rounded-lg hover:bg-slate-900 duration-300 cursor-pointer"
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
                  className="flex-shrink-0 w-60 p-4 bg-white border rounded shadow-lg hover:scale-105 hover:z-10 transition-transform duration-300 dark:bg-gray-700 dark:border-gray-500"
                >
                  <img
                    src={
                      book.volumeInfo.imageLinks?.thumbnail ||
                      "https://via.placeholder.com/128x194?text=No+Image"
                    }
                    alt={book.volumeInfo.title}
                    className="w-full h-40 object-contain rounded  dark:bg-gray-700"
                  />
                  <div className="h-14 overflow-hidden">
                    <h3 className="font-semibold mt-2 dark:text-white">
                      {book.volumeInfo.title}
                    </h3>
                  </div>
                  <div className="h-8">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {book.volumeInfo.authors?.join(", ") || "Unknown Author"}
                    </p>
                  </div>
                  <button
                    onClick={() => addToBookshelf(book)}
                    className="px-2 py-2 bg-black text-white mt-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 duration-300 cursor-pointer"
                  >
                    Add to Bookshelf
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
                className="flex-shrink-0 w-60 p-4 bg-white border rounded shadow-lg hover:scale-105 hover:z-10 transition-transform duration-300 dark:bg-gray-700 dark:border-gray-500"
              >
                <img
                  src={book.thumbnail}
                  alt={book.title}
                  className="w-full h-40 object-contain rounded"
                />
                <h3 className="h-16 font-bold dark:text-white">{book.title}</h3>
                <p className="h-16 text-sm text-gray-600 dark:text-white">
                  {book.authors?.join(", ")}
                </p>
                {/* Display Average Rating */}
                <p className="h-8 text-sm text-gray-600 dark:text-white">
                  Average Rating: {book.averageRating.toFixed(1)}
                </p>
                {/* User Review Form */}
                <div>
                  <label className="dark:text-white">Rate this book: </label>
                  <select
                    className=" h-8 p-1 border rounded bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-500"
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

                  <textarea
                    className="w-full mt-2 p-2 border rounded bg-white text-black dark:bg-gray-700 dark:text-white dark:border-gray-500"
                    placeholder="Write a review..."
                    value={book.userReview || ""}
                    onChange={(e) =>
                      handleReviewChange(book.bookId, e.target.value)
                    }
                  ></textarea>

                  <button
                    className="px-3 py-2 mt-2 bg-green-500 text-white rounded-lg hover:bg-green-600 duration-300"
                    onClick={() => submitReview(book.bookId)}
                  >
                    Submit
                  </button>
                  <button
                    className="px-3 py-2 ml-2 mt-2 bg-red-500 text-white rounded-lg hover:bg-red-600 duration-300"
                    onClick={() => deleteReview(book.bookId)}
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => removeFromBookshelf(book._id)}
                    className="px-1 py-2 mt-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 duration-300"
                  >
                    Remove from the Bookshelf
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No books in your bookshelf yet.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Bookshelf;
