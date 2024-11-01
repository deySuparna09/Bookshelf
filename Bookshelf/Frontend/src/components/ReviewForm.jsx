import { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const ReviewForm = ({ bookId, fetchReviews }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/reviews/add', { bookId, rating, comment });
      setRating(0);
      setComment('');
      fetchReviews();  // Refresh reviews after submission
    } catch (error) {
      console.error('Error adding review', error);
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit}>
      <h3>Leave a Review</h3>
      <label htmlFor="rating">Rating:</label>
      <input id="rating"
        type="number"
        min="1"
        max="5"
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        required
      />
      <textarea
        placeholder="Write your review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        required
      />
      <button type="submit">Submit</button>
    </form>
    </>
  );
};

ReviewForm.propTypes = {
  bookId: PropTypes.string.isRequired,
  fetchReviews: PropTypes.func.isRequired,
};

export default ReviewForm;