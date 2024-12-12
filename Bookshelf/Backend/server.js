require("dotenv").config();
const express = require("express");
const session = require("express-session");
const passport = require("passport");
require("./config/passport");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/book");
const app = express();
app.enable("trust proxy");

const clientURL = process.env.DEPLOYED_CLIENT_URL || process.env.CLIENT_URL;
app.use(
  cors({
    origin: clientURL,
    credentials: true, // Allows cookies to be sent
    methods: ["GET", "POST", "OPTIONS"],
  })
);

app.use(express.json());

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    proxy: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/book", bookRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
