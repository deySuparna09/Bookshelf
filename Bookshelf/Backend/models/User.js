// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const userSchema = new mongoose.Schema({
//   provider: { type: String, required: true },
//   providerId: { type: String, required: true },
//   username: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   refreshToken: { type: String },
//   avatar: { type: String },
// });

// // Hash password before saving user
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// const User = mongoose.model("User", userSchema);

// module.exports = User;

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    provider: { 
      type: String, 
      required: false,
      enum: ["google", "facebook", "local"], // Example providers; adjust as needed
    },
    providerId: { type: String, required: false },
    username: { type: String, required: true },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      match: [/\S+@\S+\.\S+/, 'Please provide a valid email address'],
    },
    password: { type: String, required: true },
    refreshToken: { type: String },
    avatar: { type: String, default: "" },
  },
  { timestamps: true }
);

// Hash password before saving user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Custom error handling for unique fields
userSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoError" && error.code === 11000) {
    next(new Error("Email already in use"));
  } else {
    next(error);
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
