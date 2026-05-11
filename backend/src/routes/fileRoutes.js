import express from "express";
import {
  uploadFile,
  getAllFiles,
  deleteFile,
} from "../controllers/fileController.js";
import authMiddleware from "../middleware/auth.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Upload File (Protected)
router.post("/upload", authMiddleware, upload.single("file"), uploadFile);

// Get All Files (Protected)
router.get("/", authMiddleware, getAllFiles);

// Delete File (Protected)
router.delete("/:id", authMiddleware, deleteFile);

export default router;
