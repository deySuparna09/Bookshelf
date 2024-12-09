import { useEffect, useState, useContext } from "react";
import axiosInstance from "../utils/axiosInstance";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { ThemeContext } from "./ThemeContext";

const Dashboard = () => {
  const { user } = useAuth();
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("reading");
  const [loading, setLoading] = useState(false);
  const [updatingBookId, setUpdatingBookId] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const fetchBooksByStatus = async (status) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/api/book/status/${status}`);
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books by status:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateBook = async (bookId, updateData) => {
    try {
      const response = await axiosInstance.put(`/api/book/${bookId}`, updateData);
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.bookId === bookId ? { ...book, ...response.data } : book
        )
      );
    } catch (error) {
      console.error("Error updating book:", error);
    } finally {
      setUpdatingBookId(null);
    }
  };

  const handleProgressUpdate = (bookId, currentProgress) => {
    const newProgress = currentProgress + 20;

    setUpdatingBookId(bookId);
    if (newProgress >= 100) {
      updateBook(bookId, { progress: 100, status: "finished" });
    } else {
      updateBook(bookId, { progress: newProgress });
    }
  };

  const handleStatusUpdate = async (bookId, newStatus) => {
    try {
      const response = await axiosInstance.put(`/api/book/${bookId}`, {
        status: newStatus,
      });
      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.bookId === bookId ? { ...book, ...response.data } : book
        )
      );

      if (newStatus === "reading" && statusFilter !== "reading") {
        setStatusFilter("reading");
      }
    } catch (error) {
      console.error("Error updating book status:", error);
    }
  };

  useEffect(() => {
    fetchBooksByStatus(statusFilter);
  }, [statusFilter]);

  if (!user) {
    return <p>Redirecting to login...</p>;
  }

  return (
    <div
      className={`dashboard p-6 min-h-screen sm:p-8 md:p-12 ${
        theme === "dark"
          ? "bg-gray-800 text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <h1 className="text-2xl font-bold mb-4">My Dashboard</h1>

      <div className="mb-4 mt-3 flex flex-wrap gap-2">
        <button
          className={`px-4 py-2 w-full sm:w-auto ${
            statusFilter === "reading"
              ? theme === "dark"
                ? "bg-blue-700 text-white"
                : "bg-blue-500 text-white"
              : theme === "dark"
              ? "bg-gray-700 text-white"
              : "bg-gray-200 text-black"
          }`}
          onClick={() => setStatusFilter("reading")}
        >
          Currently Reading
        </button>
        <button
          className={`px-4 py-2 w-full sm:w-auto ${
            statusFilter === "finished"
              ? theme === "dark"
                ? "bg-blue-700 text-white"
                : "bg-blue-500 text-white"
              : theme === "dark"
              ? "bg-gray-700 text-white"
              : "bg-gray-200 text-black"
          }`}
          onClick={() => setStatusFilter("finished")}
        >
          Finished
        </button>
        <button
          className={`px-4 py-2 w-full sm:w-auto ${
            statusFilter === "not_started"
              ? theme === "dark"
                ? "bg-blue-700 text-white"
                : "bg-blue-500 text-white"
              : theme === "dark"
              ? "bg-gray-700 text-white"
              : "bg-gray-200 text-black"
          }`}
          onClick={() => setStatusFilter("not_started")}
        >
          Not Started
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : books.length > 0 ? (
        <ul>
          {books.map((book) => (
            <li
              key={book.bookId}
              className="mb-4 border-b pb-4 flex flex-wrap gap-4 items-start"
            >
              {book.thumbnail && (
                <img
                  src={book.thumbnail}
                  alt={`Cover of ${book.title}`}
                  className="w-24 h-36 object-cover rounded shadow"
                />
              )}
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{book.title}</h2>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  By: {book.authors.join(", ")}
                </p>
                <div className="w-full sm:w-64 bg-gray-200 rounded mt-2">
                  <div
                    className="bg-green-500 text-xs font-medium text-white text-center p-1 leading-none rounded transition-all duration-300"
                    style={{ width: `${book.progress}%` }}
                  >
                    {book.progress}%
                  </div>
                </div>
                <p className="mt-1">Status: {book.status}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                {book.status === "not_started" && (
                  <button
                    onClick={() => handleStatusUpdate(book.bookId, "reading")}
                    className={`px-4 py-2 ${
                      theme === "dark" ? "bg-yellow-600" : "bg-yellow-500"
                    } text-white rounded shadow-md hover:shadow-lg`}
                  >
                    Start Reading
                  </button>
                )}
                {book.status === "reading" && (
                  <button
                    onClick={() =>
                      handleProgressUpdate(book.bookId, book.progress)
                    }
                    className={`px-4 py-2 ${
                      updatingBookId === book.bookId
                        ? "bg-gray-400 cursor-not-allowed"
                        : theme === "dark"
                        ? "bg-green-600"
                        : "bg-green-500"
                    } text-white rounded shadow-md hover:shadow-lg`}
                    disabled={updatingBookId === book.bookId}
                  >
                    {updatingBookId === book.bookId
                      ? "Updating..."
                      : "Update Progress"}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No books found for this status.</p>
      )}
    </div>
  );
};

Dashboard.propTypes = {
  userId: PropTypes.string,
};

export default Dashboard;
