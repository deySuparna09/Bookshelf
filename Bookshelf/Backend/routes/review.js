const express = require('express');
const { addReview, getReviews } = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware'); // Assuming you have an authentication middleware

const router = express.Router();

router.post('/add', authMiddleware, addReview); // Add a new review (authenticated)
router.get('/:bookId', getReviews); // Get all reviews for a book
router.post('/:reviewId/like', authMiddleware, likeReview); // Like a review
module.exports = router;