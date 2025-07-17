// backend/src/routes/test.js
import express from "express";
import { upload } from "../middleware/upload.js";

const router = express.Router();

// Test image upload
router.post("/upload", upload.productImage, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully to Cloudinary!",
      data: {
        filename: req.file.filename,
        url: req.file.path,
        size: req.file.size,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Upload failed",
      error: error.message,
    });
  }
});

export default router;
