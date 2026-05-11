import express from "express";
import {
  sendMessage,
  getAllMessages,
  getMessageById,
  replyToMessage,
  deleteMessage,
} from "../controllers/messageController.js";
import { validateMessage, handleValidationErrors } from "../validators/index.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Send Message (Public)
router.post("/send-message", validateMessage, handleValidationErrors, sendMessage);

// Get All Messages (Protected - Admin only)
router.get("/admin/messages", authMiddleware, getAllMessages);

// Get Single Message (Protected - Admin only)
router.get("/:id", authMiddleware, getMessageById);

// Reply to Message (Protected - Admin only)
router.post("/:id/reply", authMiddleware, replyToMessage);

// Delete Message (Protected - Admin only)
router.delete("/:id", authMiddleware, deleteMessage);

export default router;
