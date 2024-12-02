import PropTypes from "prop-types";

const SocialCard = ({ update, isFriend, onAddFriend }) => (
  <div className="border p-4 rounded shadow mb-4">
    <h3 className="text-lg font-bold">{update.bookId?.title || "Untitled"}</h3>
    <p className="text-sm text-gray-500">
      By: {update.bookId?.authors?.join(", ") || "Unknown Authors"}
    </p>
    <p className="mt-2">Rating: {update.rating || "No rating"} ⭐</p>
    {update.review && <p className="italic mt-2">{`"${update.review}"`}</p>}
    <p className="text-sm text-gray-400 mt-2">Updated by: {update.userId.name || "Unknown User"}</p>
    {!isFriend && (
      <button
        className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
        onClick={() => onAddFriend(update.userId._id)}
      >
        Add Friend
      </button>
    )}
  </div>
);

SocialCard.propTypes = {
  update: PropTypes.shape({
    bookId: PropTypes.shape({
      title: PropTypes.string.isRequired,
      authors: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    rating: PropTypes.number.isRequired,
    review: PropTypes.string,
    userId: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  isFriend: PropTypes.bool.isRequired,
  onAddFriend: PropTypes.func.isRequired,
};

export default SocialCard;
