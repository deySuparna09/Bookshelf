const Review = require("../models/Review"); // Reviews schema
const User = require("../models/User"); // Users schema with friends list

const getFriendsUpdates = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find user's friends list
    const user = await User.findById(userId).populate("friends", "_id");
    const friendsIds = user.friends.map((friend) => friend._id);

    // Fetch updates (reviews/ratings) from friends
    const updates = await Review.find({ userId: { $in: friendsIds } })
      .sort({ createdAt: -1 })
      .populate("bookId", "title authors"); // Populate book details

    res.status(200).json(updates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching updates" });
  }
};

module.exports = { getFriendsUpdates };
