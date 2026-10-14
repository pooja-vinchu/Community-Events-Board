const mongoose = require("mongoose");

const cardDesignSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  theme: {
    type: String,
    enum: ["gradient-blue", "gradient-purple", "gradient-orange"],
    default: "gradient-blue",
  },
  stickers: [
    {
      type: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

cardDesignSchema.index({ userId: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model("CardDesign", cardDesignSchema);
