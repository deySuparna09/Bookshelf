import { useEffect, useState } from 'react';
import axiosInstance from "../utils/axiosInstance"; 
import PropTypes from 'prop-types';

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("reading"); // Default filter
  const [loading, setLoading] = useState(false);

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
          book._id === bookId ? { ...book, ...response.data } : book
        )
      );
      alert("Book updated successfully!");
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  // Handle progress update
  const handleProgressUpdate = (bookId, currentProgress) => {
    console.log("Updating progress for bookId:", bookId);

    // Check if the progress will reach or exceed 100
    const newProgress = currentProgress + 20;
    if (newProgress >= 100) {
      // Set progress to 100 and mark as finished
      updateBook(bookId, { progress: 100, status: "finished" });
      alert("Congratulations! You've finished reading the book.");
    } else {
      // Update progress
      updateBook(bookId, { progress: newProgress });
    }
  };

  // Handle status update
  const handleStatusUpdate = async (bookId, newStatus) => {

  try {
    const updatedBook = await axiosInstance.put(`/api/book/${bookId}`, { status: newStatus });

    setBooks((prevBooks) => {
      // Remove the book from the current list if its status changes out of the current filter
      if (updatedBook.data.status !== statusFilter) {
        return prevBooks.filter((book) => book._id !== bookId);
      }

      // Otherwise, update the book in place
      return prevBooks.map((book) =>
        book._id === bookId ? { ...book, ...updatedBook.data } : book
      );
    });

    // Adjust status filter if necessary
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

  return (
    <>
      <div className="dashboard p-6">
        <h1 className="text-2xl font-bold mb-4">My Dashboard</h1>

        {/* Status Filter */}
        <div className="mb-4">
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
              <li key={book._id} className="mb-4 border-b pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">{book.title}</h2>
                    <p className="text-sm text-gray-500">By: {book.authors.join(", ")}</p>
                    <p>Progress: {book.progress}%</p>
                    <p>Status: {book.status}</p>
                  </div>
                  <div className="flex gap-2">
                    {book.status === "not_started" && (
                      <button
                        onClick={() => handleStatusUpdate(book._id, "reading")}
                        className="px-3 py-1 bg-yellow-500 text-white rounded"
                      >
                        Start Reading
                      </button>
                    )}
                    {book.status === "reading" && (
                      <button
                        onClick={() => handleProgressUpdate(book._id, book.progress)}
                        className="px-3 py-1 bg-green-500 text-white rounded"
                      >
                        Update Progress
                      </button>
                    )}
                    {statusFilter !== "reading" && book.status == "reading" && (
                      <button
                        onClick={() => handleStatusUpdate(book._id, "finished")}
                        className="px-3 py-1 bg-blue-500 text-white rounded"
                      >
                        Mark as Finished
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
    </>
  );
};

Dashboard.propTypes = {
  userId: PropTypes.string,
};

export default Dashboard;



