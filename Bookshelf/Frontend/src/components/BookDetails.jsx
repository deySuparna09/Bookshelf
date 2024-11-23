import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReviewForm from './ReviewForm'; // Import ReviewForm
import ReviewList from './ReviewList'; // Import ReviewsList
import axiosInstance from '../utils/axiosInstance'

const BookDetails = () => {
  const { id } = useParams(); // Get book ID from the URL
  const [book, setBook] = useState(null);

  // Fetch book details
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axiosInstance.get(`/api/books/${id}`);
        setBook(response.data);
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    };

    fetchBookDetails();
  }, [id]);

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="book-details-container p-4">
        {/* Book Information */}
        <img src={book.thumbnail} alt={book.title} className="w-48 h-72" />
        <h2 className="text-3xl font-bold">{book.title}</h2>
        <p className="text-lg">Author: {book.authors.join(',')}</p>
        <p className="text-lg">Description: {book.description}</p>
        <p className="text-lg">Rating: {book.rating}</p>
        <button className="btn mt-4">Add to Bookshelf</button>

        {/* Reviews Section */}
        <div className="reviews-section mt-8">
          <h3 className="text-xl font-semibold mb-4">Reviews:</h3>

          {/* Display the list of reviews */}
          <ReviewList bookId={id} />

          {/* Form to add a new review */}
          <div className="add-review-section mt-6">
            <h3 className="text-lg font-semibold mb-2">Leave a Review</h3>
            <ReviewForm bookId={id} />
          </div>
        </div>
      </div>
    </>
  );
};

export default BookDetails;
