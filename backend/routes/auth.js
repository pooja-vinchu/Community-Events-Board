const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");

const router = express.Router();

router.post(
  "/admin/login",
  [body("email").isEmail().normalizeEmail(), body("password").notEmpty()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      const { email, password } = req.body;

      if (
        email !== process.env.ADMIN_EMAIL ||
        password !== process.env.ADMIN_PASSWORD
      ) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign({ email, isAdmin: true }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.json({ token, email });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  },
);

router.post(
  "/signup",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({
            error: "Invalid email or password must be at least 6 characters",
          });
      }

      const { email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        email,
        password: hashedPassword,
        favoriteCategories: [],
      });

      await user.save();

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.status(201).json({
        token,
        user: {
          id: user._id,
          email: user.email,
          favoriteCategories: user.favoriteCategories,
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  },
);

router.post(
  "/login",
  [body("email").isEmail().normalizeEmail(), body("password").notEmpty()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          favoriteCategories: user.favoriteCategories,
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  },
);

module.exports = router;
