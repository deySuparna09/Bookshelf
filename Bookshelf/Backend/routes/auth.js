const express = require("express");
const passport = require("passport");
const {
  register,
  login,
  me,
  refreshToken,
  forgotPassword,
  resetPassword,
  githubCallback,
} = require("../controllers/authController");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:resetToken", resetPassword);
router.get("/me", me); // Add this line for the me route
router.post("/refreshToken", refreshToken);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

// GitHub Callback Route
router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    session: false,
  }),
  githubCallback
);

module.exports = router;
