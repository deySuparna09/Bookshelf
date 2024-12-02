const express = require("express");
const router = express.Router();
const { getFriendsUpdates } = require("../controllers/reviewController");

router.get("/friends-updates/:userId", getFriendsUpdates);

module.exports = router;
