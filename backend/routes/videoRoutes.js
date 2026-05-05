const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const Video = require("../models/Video");

// multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

/* =========================
   📥 UPLOAD ROUTE
========================= */
router.post("/upload", upload.single("video"), async (req, res) => {
    console.log("Upload request received!");
  console.log("Body:", req.body);
  console.log("File received:", !!req.file);
  
  try {
    const userName = req.body.userName?.trim();
    if (!userName || !req.file) {
      return res.status(400).json({ error: "Missing name or video file" });
    }

    const uploadToCloudinary = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "video",
            folder: `videos/${userName.replace(/\s+/g, "_")}`,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        stream.end(req.file.buffer);
      });

    const result = await uploadToCloudinary();

    const video = new Video({
      userName,
      videoUrl: result.secure_url,
      publicId: result.public_id,
      folder: result.folder,
    });

    await video.save();

    res.json(video);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* =========================
   📊 GET VIDEOS (ADD HERE 👇)
========================= */
router.get("/videos", async (req, res) => {
  try {
    const videos = await Video.find();

    console.log("VIDEOS FROM DB:", videos); // 👈 DEBUG LINE

    const grouped = {};
    videos.forEach((v) => {
      if (!grouped[v.userName]) grouped[v.userName] = [];
      grouped[v.userName].push(v);
    });

    res.json(grouped);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;