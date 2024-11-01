const Review = require('../models/Review');

// Add a new review
exports.addReview = async (req, res) => {
  const { bookId, rating, comment } = req.body;
  try {
    const newReview = new Review({
      user: req.user._id,  // Assuming the user is authenticated
      bookId,
      rating,
      comment,
    });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    res.status(400).json({ message: 'Failed to add review', error });
  }
};

// Get reviews for a specific book
exports.getReviews = async (req, res) => {
  const { bookId } = req.params;
  try {
    const reviews = await Review.find({ bookId }).populate('user', 'name'); // Populate user info
    res.status(200).json(reviews);
  } catch (error) {
    res.status(400).json({ message: 'Failed to get reviews', error });
  }
};
//Add like to a review
exports.likeReview = async (req, res) => {
  const { reviewId } = req.params;
  try {
    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    // Check if the user already liked the review
    if (review.likes.includes(req.user._id)) {
      return res.status(400).json({ message: 'You already liked this review' });
    }

    review.likes.push(req.user._id);
    await review.save();
    res.status(200).json(review);
  } catch (error) {
    res.status(400).json({ message: 'Failed to like review', error });
  }
};