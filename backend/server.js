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

// CORS - Allow your frontend
const corsOptions = {
  origin: [
    "https://videostorage.vercel.app",  
    "http://localhost:5173",
    "http://localhost:3000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ extended: true, limit: "500mb" }));

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// Routes
app.use("/api", require("./routes/videoRoutes"));

// Health checks
app.get("/", (req, res) => res.send("Backend is running ✅"));
app.get("/api/health", (req, res) => res.json({ status: "OK", message: "Healthy" }));

// Export for Vercel
module.exports = app;