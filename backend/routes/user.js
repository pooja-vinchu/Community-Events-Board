const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const Event = require("../models/Event");
const CardDesign = require("../models/CardDesign");
const { authenticateUser } = require("../middleware/auth");

const router = express.Router();

router.use(authenticateUser);

router.get("/profile", async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

router.put(
  "/categories",
  [
    body("categories").isArray(),
    body("categories.*").isIn(["Music", "Workshop", "Food", "Sports", "Kids"]),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: "Invalid categories" });
      }

      const user = await User.findById(req.user._id);
      user.favoriteCategories = req.body.categories;
      await user.save();

      res.json({ favoriteCategories: user.favoriteCategories });
    } catch (error) {
      res.status(500).json({ error: "Failed to update categories" });
    }
  },
);

router.get("/feed", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const user = await User.findById(req.user._id);

    if (!user.favoriteCategories || user.favoriteCategories.length === 0) {
      return res.json({
        events: [],
        pagination: {
          page,
          limit,
          total: 0,
          pages: 0,
        },
      });
    }

    const query = {
      isActive: true,
      dateTime: { $gte: new Date() },
      category: { $in: user.favoriteCategories },
    };

    const events = await Event.find(query)
      .sort({ dateTime: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Event.countDocuments(query);

    res.json({
      events,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch feed" });
  }
});

router.post("/reminders/:eventId", async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const eventId = req.params.eventId;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const reminderIndex = user.reminders.indexOf(eventId);

    if (reminderIndex > -1) {
      user.reminders.splice(reminderIndex, 1);
    } else {
      user.reminders.push(eventId);
    }

    await user.save();

    res.json({
      hasReminder: reminderIndex === -1,
      reminders: user.reminders,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update reminder" });
  }
});

router.get("/reminders", async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ reminders: user.reminders });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reminders" });
  }
});

router.get("/events/:eventId/card-design", async (req, res) => {
  try {
    const design = await CardDesign.findOne({
      userId: req.user._id,
      eventId: req.params.eventId,
    });

    if (!design) {
      return res.json({
        theme: "gradient-blue",
        stickers: [],
      });
    }

    res.json({
      theme: design.theme,
      stickers: design.stickers,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch card design" });
  }
});

router.post(
  "/events/:eventId/card-design",
  [
    body("theme").isIn(["gradient-blue", "gradient-purple", "gradient-orange"]),
    body("stickers").isArray(),
    body("stickers").custom((value) => value.length <= 3),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: "Invalid card design data" });
      }

      const { theme, stickers } = req.body;

      let design = await CardDesign.findOne({
        userId: req.user._id,
        eventId: req.params.eventId,
      });

      if (design) {
        design.theme = theme;
        design.stickers = stickers;
        design.updatedAt = Date.now();
        await design.save();
      } else {
        design = new CardDesign({
          userId: req.user._id,
          eventId: req.params.eventId,
          theme,
          stickers,
        });
        await design.save();
      }

      res.json({
        theme: design.theme,
        stickers: design.stickers,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to save card design" });
    }
  },
);

module.exports = router;
