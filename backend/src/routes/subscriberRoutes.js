import express from "express";
import {
  subscribe,
  unsubscribe,
  getAllSubscribers,
} from "../controllers/subscriberController.js";
import { validateSubscriber, handleValidationErrors } from "../validators/index.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Subscribe (Public)
router.post("/new", validateSubscriber, handleValidationErrors, subscribe);

// Unsubscribe (Public)
router.post("/unsubscribe", validateSubscriber, handleValidationErrors, unsubscribe);

// Get All Subscribers (Protected - Admin only)
router.get("/", authMiddleware, getAllSubscribers);

export default router;
