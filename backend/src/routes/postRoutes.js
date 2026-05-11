import express from "express";
import {
  createPost,
  getAllPosts,
  getPostBySlug,
  updatePost,
  deletePost,
  getAdminPosts,
} from "../controllers/postController.js";
import { validatePost, handleValidationErrors } from "../validators/index.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Create Post (Protected)
router.post("/create", authMiddleware, validatePost, handleValidationErrors, createPost);

// Get All Published Posts
router.get("/", getAllPosts);

// Get Single Post by Slug
router.get("/:slug", getPostBySlug);

// Get Admin Posts (Protected)
router.get("/admin/my-posts", authMiddleware, getAdminPosts);

// Update Post (Protected)
router.put("/:id", authMiddleware, updatePost);

// Delete Post (Protected)
router.delete("/:id", authMiddleware, deletePost);

export default router;
