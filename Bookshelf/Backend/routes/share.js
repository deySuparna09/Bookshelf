const express = require("express");
const {
  createShare,
  getSharedBook,
} = require("../controllers/shareController");
const router = express.Router();

// Route to create a shareable entry
router.post("/", createShare);

// Route to fetch shared book details
router.get("/:shareId", getSharedBook);

module.exports = router;
