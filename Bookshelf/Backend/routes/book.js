const express = require('express');
const { addBook, getBooks } = require('../controllers/bookController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, addBook);
router.get('/', authMiddleware, getBooks);

module.exports = router;