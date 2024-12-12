const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Register a new user
const register = async (req, res) => {
  const { username, email, password, providerId, provider } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving
    // console.log(password);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      providerId,
      provider,
    });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(201).json({ token, user: { id: user._id, username, email } });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login a user
const login = async (req, res) => {
  const { email, password, providerId, provider } = req.body;
  try {
    let user;
    if (providerId && provider) {
      user = await User.findOne({ providerId, provider });
      if (!user) {
        return res
          .status(400)
          .json({ message: "User not found for this provider." });
      }
    } else {
      user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
    }

    // Generate access and refresh tokens
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(
      { id: user._id, providerId: user.providerId, provider: user.provider },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Save refresh token to the user in the database
    user.refreshToken = refreshToken;
    await user.save();

    // Return tokens to the client
    res.json({ user, accessToken, refreshToken });
  } catch (error) {
    console.error("Login error:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({ message: "Validation error" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// Refresh token
const refreshToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(403).json({ message: "Refresh token is required" });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // Find the user by ID and check if the refresh token matches the one in the database
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== token) {
      user.refreshToken = null;
      await user.save();
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    if (!user.providerId || !user.provider) {
      return res.status(400).json({ message: "User data is incomplete" });
    }

    // Generate a new access token (valid for 1 hour)
    const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const newRefreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Save the new refresh token in the database
    user.refreshToken = newRefreshToken;
    await user.save();

    // Log token expiration times for debugging
    console.log(
      "New access token expires at: ",
      new Date(jwt.decode(newAccessToken).exp * 1000)
    );
    console.log(
      "New refresh token expires at: ",
      new Date(jwt.decode(newRefreshToken).exp * 1000)
    );

    // Return the new tokens to the client
    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    console.error("Error refreshing token:", error);
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
};

// Get user data (Me endpoint)
const me = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ id: user._id, username: user.username, email: user.email });
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token expired" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// Forgot Password - Send Reset Link
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  //console.log("Received email:", email);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a password reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    //console.log("Generated Reset Token:", resetToken);
    const resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();
    //console.log("User updated with resetToken:", user);

    // Create a transporter using Ethereal email service
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: false, // Use false for non-SSL connections
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    //console.log("Ethereal Email User:", testAccount.user);
    //console.log("Ethereal Email Pass:", testAccount.pass);

    const resetURL = `${
      process.env.DEPLOYED_CLIENT_URL || process.env.CLIENT_URL
    }/reset-password/${resetToken}`;
    const mailOptions = {
      from: `"Bookshelf App" <${testAccount.user}>`, // Sender address
      to: email, // Receiver address
      subject: "Password Reset Request",
      text: `You requested a password reset. Click the link below to reset your password:\n\n${resetURL}`,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info)); // Preview the email

    res.status(200).json({
      message: "Password reset email sent",
      previewURL: nodemailer.getTestMessageUrl(info),
    });
  } catch (error) {
    console.error("Forgot Password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Reset Password - Update Password
const resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;

  try {
    const user = await User.findOne({ resetToken });
    if (!user || user.resetTokenExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = undefined; // Remove the reset token after successful change
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Reset Password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const githubCallback = (req, res) => {
  try {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(
      { id: req.user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    const user = {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
    };

    const clientUrl = process.env.DEPLOYED_CLIENT_URL || process.env.CLIENT_URL;
    // Redirect with tokens as query parameters
    res.redirect(
      `${clientUrl}/github/callback?token=${token}&refreshToken=${refreshToken}&user=${encodeURIComponent(
        JSON.stringify(user)
      )}`
    );
  } catch (error) {
    console.error("GitHub callback error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  register,
  login,
  me,
  refreshToken,
  forgotPassword,
  resetPassword,
  githubCallback,
};
