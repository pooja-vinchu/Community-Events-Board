const express = require("express");
const { body, validationResult } = require("express-validator");
const Event = require("../models/Event");
const { authenticateAdmin } = require("../middleware/auth");

const router = express.Router();

router.use(authenticateAdmin);

router.post(
  "/events",
  [
    body("title").notEmpty().trim(),
    body("category").isIn(["Music", "Workshop", "Food", "Sports", "Kids"]),
    body("city").notEmpty().trim(),
    body("dateTime").isISO8601(),
    body("price").isNumeric().isFloat({ min: 0 }),
    body("description").notEmpty().trim(),
    body("imageUrl").notEmpty().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ error: "Invalid event data", details: errors.array() });
      }

      const event = new Event(req.body);
      await event.save();

      res.status(201).json(event);
    } catch (error) {
      res.status(500).json({ error: "Failed to create event" });
    }
  },
);

router.put(
  "/events/:id",
  [
    body("title").optional().notEmpty().trim(),
    body("category")
      .optional()
      .isIn(["Music", "Workshop", "Food", "Sports", "Kids"]),
    body("city").optional().notEmpty().trim(),
    body("dateTime").optional().isISO8601(),
    body("price").optional().isNumeric().isFloat({ min: 0 }),
    body("description").optional().notEmpty().trim(),
    body("imageUrl").optional().notEmpty().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ error: "Invalid event data", details: errors.array() });
      }

      const event = await Event.findByIdAndUpdate(
        req.params.id,
        { ...req.body, updatedAt: Date.now() },
        { new: true, runValidators: true },
      );

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      res.json(event);
    } catch (error) {
      res.status(500).json({ error: "Failed to update event" });
    }
  },
);

router.patch("/events/:id/status", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    event.isActive = !event.isActive;
    event.updatedAt = Date.now();
    await event.save();

    res.json(event);
  } catch (error) {
    res.status(500).json({ error: "Failed to update event status" });
  }
});

router.get("/events", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.category) query.category = req.query.category;
    if (req.query.city) query.city = new RegExp(req.query.city, "i");
    if (req.query.isActive !== undefined)
      query.isActive = req.query.isActive === "true";

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
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

module.exports = router;
