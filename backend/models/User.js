const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  favoriteCategories: [
    {
      type: String,
      enum: ["Music", "Workshop", "Food", "Sports", "Kids"],
    },
  ],
  reminders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.index({ email: 1 });

module.exports = mongoose.model("User", userSchema);
