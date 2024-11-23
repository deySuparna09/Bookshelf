const express = require('express');
const { getDashboardData } = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Get the user's dashboard data
router.get('/', authMiddleware, getDashboardData);

module.exports = router;