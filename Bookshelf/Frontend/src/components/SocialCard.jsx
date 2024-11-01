import PropTypes from "prop-types";
const SocialCard = ({review}) => {
  return (
    <>
    <div className="border p-4 rounded mb-2">
      <h3>{review.user}</h3>
      <p>{review.text}</p>
      <p>Rating: {review.rating}</p>
    </div>
    </>
  );
};

SocialCard.propTypes = {
  review: PropTypes.shape({
    user: PropTypes.string.isRequired,  // Ensure user is a required string
    text: PropTypes.string.isRequired,  // Ensure text is a required string
    rating: PropTypes.number.isRequired, // Ensure rating is a required number
  }).isRequired, // The review prop is required
};

export default SocialCard;
