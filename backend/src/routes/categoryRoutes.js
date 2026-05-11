import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { validateCategory, handleValidationErrors } from "../validators/index.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Create Category (Protected)
router.post("/new", authMiddleware, validateCategory, handleValidationErrors, createCategory);

// Get All Categories (Public)
router.get("/public", getAllCategories);

// Get Single Category by Slug (Public)
router.get("/:slug", getCategoryBySlug);

// Update Category (Protected)
router.put("/:id", authMiddleware, updateCategory);

// Delete Category (Protected)
router.delete("/:id", authMiddleware, deleteCategory);

export default router;
