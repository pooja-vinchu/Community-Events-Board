const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Music", "Workshop", "Food", "Sports", "Kids"],
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  dateTime: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

eventSchema.index({ title: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ city: 1 });
eventSchema.index({ dateTime: 1 });
eventSchema.index({ isActive: 1 });
eventSchema.index({ category: 1, city: 1, isActive: 1, dateTime: 1 });

module.exports = mongoose.model("Event", eventSchema);
