import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State hooks should not be inside conditions
  const [books, setBooks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("reading");
  const [loading, setLoading] = useState(false);
  const [updatingBookId, setUpdatingBookId] = useState(null);

  // Redirect to login if user is not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Fetch books based on status
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

  // Update book progress or status
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

  // Handle progress update
  const handleProgressUpdate = (bookId, currentProgress) => {
    const newProgress = currentProgress + 20;

    setUpdatingBookId(bookId);
    if (newProgress >= 100) {
      updateBook(bookId, { progress: 100, status: "finished" });
    } else {
      updateBook(bookId, { progress: newProgress });
    }
  };

  // Handle status update
  const handleStatusUpdate = async (bookId, newStatus) => {
    try {
      const response = await axiosInstance.put(`/api/book/${bookId}`, { status: newStatus });
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

    // Fetch books when the component mounts or the status filter changes
  useEffect(() => {
    fetchBooksByStatus(statusFilter);
  }, [statusFilter]);

  if (!user) {
    return <p>Redirecting to login...</p>; // Optional fallback while navigating
  }

  return (
    <div className="dashboard p-6">
      <h1 className="text-2xl font-bold mb-4">My Dashboard</h1>
      {/* Status Filter */}
      <div className="mb-4 mt-3">
        <button
          className={`px-4 py-2 mr-2 ${
            statusFilter === "reading" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setStatusFilter("reading")}
        >
          Currently Reading
        </button>
        <button
          className={`px-4 py-2 mr-2 ${
            statusFilter === "finished" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setStatusFilter("finished")}
        >
          Finished
        </button>
        <button
          className={`px-4 py-2 ${
            statusFilter === "not_started" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setStatusFilter("not_started")}
        >
          Not Started
        </button>
      </div>
      {/* Book List */}
      {loading ? (
        <p>Loading...</p>
      ) : books.length > 0 ? (
        <ul>
          {books.map((book) => (
            <li key={book.bookId} className="mb-4 border-b pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{book.title}</h2>
                  <p className="text-sm text-gray-500">By: {book.authors.join(", ")}</p>
                  <div className="w-full bg-gray-200 rounded mt-2">
                    <div
                      className={`bg-green-500 text-xs font-medium text-white text-center p-1 leading-none rounded transition-all duration-300`}
                      style={{ width: `${book.progress}%` }}
                    >
                      {book.progress}%
                    </div>
                  </div>
                  <p>Status: {book.status}</p>
                </div>
                <div className="flex gap-2">
                  {book.status === "not_started" && (
                    <button
                      onClick={() => handleStatusUpdate(book.bookId, "reading")}
                      className="px-3 py-1 bg-yellow-500 text-white rounded"
                    >
                      Start Reading
                    </button>
                  )}
                  {book.status === "reading" && (
                    <button
                      onClick={() => handleProgressUpdate(book.bookId, book.progress)}
                      className={`px-3 py-1 ${
                        updatingBookId === book.bookId
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-500 text-white"
                      } rounded`}
                      disabled={updatingBookId === book.bookId}
                    >
                      {updatingBookId === book.bookId ? "Updating..." : "Update Progress"}
                    </button>
                  )}
                </div>
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


