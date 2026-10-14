const express = require("express");
const Event = require("../models/Event");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {
      isActive: true,
      dateTime: { $gte: new Date() },
    };

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.city) {
      query.city = new RegExp(req.query.city, "i");
    }

    if (req.query.search) {
      query.$or = [
        { title: new RegExp(req.query.search, "i") },
        { description: new RegExp(req.query.search, "i") },
      ];
    }

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

router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch event" });
  }
});

module.exports = router;
