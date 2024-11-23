const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');

// Register a new user
const register = async (req, res) => {
  const { username, email, password, providerId, provider } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash the password before saving
    // console.log(password);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password, providerId, provider });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, user: { id: user._id, username, email } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login a user
const login = async (req, res) => {
  const { email, password, providerId, provider } = req.body;
  try {
    let user;
    if(providerId && provider){
      user = await User.findOne({ providerId, provider });
      if (!user) {
        return res.status(400).json({ message: "User not found for this provider." });
      }
    }else{
      
      user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
    }  
    
    // Generate access and refresh tokens
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user._id, providerId: user.providerId, provider: user.provider }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    // Save refresh token to the user in the database
    user.refreshToken = refreshToken;
    await user.save();

    // Return tokens to the client
    res.json({ user, accessToken, refreshToken });
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({ message: 'Validation error' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Refresh token
const refreshToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(403).json({ message: 'Refresh token is required' });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // Find the user by ID and check if the refresh token matches the one in the database
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== token) {
      user.refreshToken = null;
      await user.save();
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    if (!user.providerId || !user.provider) {
      return res.status(400).json({ message: 'User data is incomplete' });
    }

    // Generate a new access token (valid for 1 hour)
    const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const newRefreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    // Save the new refresh token in the database
    user.refreshToken = newRefreshToken;
    await user.save();

    // Log token expiration times for debugging
    console.log('New access token expires at: ', new Date(jwt.decode(newAccessToken).exp * 1000));
    console.log('New refresh token expires at: ', new Date(jwt.decode(newRefreshToken).exp * 1000));

    // Return the new tokens to the client
    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    console.error('Error refreshing token:', error);
    return res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};

// Get user data (Me endpoint)
const me = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded:', decoded);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ id: user._id, username: user.username, email: user.email });
  } catch (error) {
    console.error('Error fetching user data:', error.message);
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login, me, refreshToken };


