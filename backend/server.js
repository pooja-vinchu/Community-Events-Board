require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const seedEvents = require("./utils/seedData");

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const eventRoutes = require("./routes/events");
const userRoutes = require("./routes/user");

const app = express();

app.use(cors());
app.use(express.json());

connectDB().then(() => {
  seedEvents();
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/user", userRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
