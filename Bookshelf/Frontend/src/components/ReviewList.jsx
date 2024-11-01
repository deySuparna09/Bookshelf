import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const ReviewList = ({ bookId }) => {
  const [reviews, setReviews] = useState([]);

  // Use useCallback to memoize fetchReviews
  const fetchReviews = useCallback(async () => {
    try {
      const response = await axios.get(`/api/reviews/${bookId}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews', error);
    }
  }, [bookId]); // Add bookId as a dependency

  useEffect(() => {
    fetchReviews(); // Fetch reviews when the component mounts or bookId changes
  }, [fetchReviews]); // Use fetchReviews in the dependency array

  // Like a review
  const likeReview = async (reviewId) => {
    try {
      await axios.post(`/api/reviews/${reviewId}/like`);
      fetchReviews(); // Refresh reviews after liking
    } catch (error) {
      console.error('Error liking review', error);
    }
  };

  return (
    <div>
      <h3>Reviews:</h3>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review._id}>
            <h4>{review.user.name}</h4>
            <p>Rating: {review.rating}/5</p>
            <p>{review.comment}</p>
            <p>Likes: {review.likes.length}</p>
            <button onClick={() => likeReview(review._id)}>Like</button>
          </div>
        ))
      ) : (
        <p>No reviews yet.</p>
      )}
    </div>
  );
};

ReviewList.propTypes = {
  bookId: PropTypes.string.isRequired,
};

export default ReviewList;

