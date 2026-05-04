// // server.js
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();

// app.use(cors());
// app.use(express.json());

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch(err => console.log(err));

// app.use("/api", require("./routes/videoRoutes"));

// app.listen(process.env.PORT, () => {
//   console.log(`Server running on ${process.env.PORT}`);
// });



// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ extended: true, limit: "500mb" }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// Routes
app.use("/api", require("./routes/videoRoutes"));

// Health check routes
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Backend is healthy" });
});

// ==================== START SERVER (Local) ====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});