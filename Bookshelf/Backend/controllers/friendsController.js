const User = require("../models/User");

// Send Friend Request
const sendFriendRequest = async (req, res) => {
  const { fromUserId, toUserId } = req.body;

  try {
    await User.findByIdAndUpdate(toUserId, {
      $addToSet: { friendRequestsReceived: fromUserId },
    });
    await User.findByIdAndUpdate(fromUserId, {
      $addToSet: { friendRequestsSent: toUserId },
    });
    res.status(200).json({ message: "Friend request sent!" });
  } catch (error) {
    res.status(500).json({ error: "Error sending friend request." });
  }
};

// Accept Friend Request
const acceptFriendRequest = async (req, res) => {
  const { fromUserId, toUserId } = req.body;

  try {
    await User.findByIdAndUpdate(toUserId, {
      $addToSet: { friends: fromUserId },
      $pull: { friendRequestsReceived: fromUserId },
    });
    await User.findByIdAndUpdate(fromUserId, {
      $addToSet: { friends: toUserId },
      $pull: { friendRequestsSent: toUserId },
    });
    res.status(200).json({ message: "Friend request accepted!" });
  } catch (error) {
    res.status(500).json({ error: "Error accepting friend request." });
  }
};

// Reject Friend Request
const rejectFriendRequest = async (req, res) => {
  const { fromUserId, toUserId } = req.body;

  try {
    await User.findByIdAndUpdate(toUserId, {
      $pull: { friendRequestsReceived: fromUserId },
    });
    await User.findByIdAndUpdate(fromUserId, {
      $pull: { friendRequestsSent: toUserId },
    });
    res.status(200).json({ message: "Friend request rejected." });
  } catch (error) {
    res.status(500).json({ error: "Error rejecting friend request." });
  }
};

// Get Friends List
const getFriendsList = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate(
      "friends",
      "name email"
    );
    res.status(200).json(user.friends);
  } catch (error) {
    res.status(500).json({ error: "Error fetching friends list." });
  }
};

// Export all functions as an object
module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendsList,
};
