const express = require("express");
const passport = require("passport");
const {
  register,
  login,
  me,
  refreshToken,
} = require("../controllers/authController");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
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
  (req, res) => {
    console.log(
      process.env.JWT_SECRET,
      "heyyyyyy",
      process.env.JWT_REFRESH_SECRET
    );
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(
      { id: req.user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Redirect with tokens as query parameters (alternative to localStorage approach)
    const user = {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
    };
    res.redirect(
      `http://localhost:5173/github/callback?token=${token}&refreshToken=${refreshToken}&user=${encodeURIComponent(
        JSON.stringify(user)
      )}`
    );
  }
);

module.exports = router;
