import { useState } from "react";
import PropTypes from "prop-types";

const ShareBook = ({ onSubmit }) => {
    const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [progress, setProgress] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ rating, review, progress });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Rating:
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          {[1, 2, 3, 4, 5].map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>
      </label>
      <label>
        Review:
        <textarea value={review} onChange={(e) => setReview(e.target.value)} />
      </label>
      <label>
        Progress (%):
        <input
          type="number"
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          min="0"
          max="100"
        />
      </label>
      <button type="submit">Generate Share Link</button>
    </form>
  );
};


ShareBook.propTypes = {
    onSubmit: PropTypes.func.isRequired,
};

export default ShareBook;

