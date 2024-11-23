const Book = require('../models/Book');
const User = require('../models/User');

const getDashboardData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('friends'); // Assuming a 'friends' field in User schema
    
    const currentlyReadingBooks = await Book.find({ user: req.user.id, status: 'currently-reading' }); // Adjust query as needed

    const friendsUpdates = await Promise.all(
      user.friends.map(async (friend) => {
        const friendBook = await Book.findOne({ user: friend._id, status: 'currently-reading' });
        return {
          friendName: friend.username,
          bookTitle: friendBook ? friendBook.title : 'No book currently',
        };
      })
    );

    return res.json({ currentlyReadingBooks, friendsUpdates });
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    return res.status(500).json({ message: 'Error fetching dashboard data' });
  }
};

module.exports = { getDashboardData };