import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const BookDetails = () => {
  const { id } = useParams();
  const [books, setBooks] = useState([]);

  // Fetch book details
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axiosInstance.get(`/api/book/${id}`);
        setBooks(response.data.books || []); // Adjusted to match API response structure
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    };

    fetchBookDetails();
  }, [id]);

  if (!books.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="book-details-container p-4">
      <h1 className="text-2xl font-bold mb-6">Books</h1>

      {/* Horizontal scrollable container */}
      <div className="flex overflow-x-auto space-x-4 py-4 scrollbar-hide">
        {books.map((book) => (
          <div
            key={book.id}
            className="flex-shrink-0 w-60 p-4 bg-white border rounded shadow-lg"
          >
            {/* Book Image */}
            <img
              src={book.thumbnail || '/placeholder.jpg'}
              alt={book.title}
              className="w-full h-40 object-cover rounded"
            />
            {/* Book Details */}
            <h2 className="text-lg font-semibold mt-4">{book.title}</h2>
            <p className="text-sm text-gray-600">
              Author: {book.authors?.join(', ') || 'Unknown'}
            </p>
            <button className="btn bg-blue-500 text-white mt-4 w-full py-2 rounded hover:bg-blue-600">
              Add to Bookshelf
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookDetails;
