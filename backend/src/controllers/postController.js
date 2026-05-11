import Post from "../models/Post.js";
import Category from "../models/Category.js";
import { generateSlug } from "../utils/helpers.js";

// Create Post
export const createPost = async (req, res, next) => {
  try {
    const { title, content, excerpt, categoryID, tags } = req.body;
    const userId = req.user.userId;

    // Check if category exists
    const category = await Category.findById(categoryID);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    const slug = generateSlug(title);

    // Check if slug already exists
    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      return res.status(400).json({ success: false, message: "Slug already exists" });
    }

    const post = new Post({
      title,
      slug,
      content,
      excerpt,
      categoryID,
      author: userId,
      tags: tags || [],
    });

    await post.save();

    // Update category post count
    category.postCount += 1;
    await category.save();

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Published Posts
export const getAllPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, categoryID } = req.query;

    let query = { status: "published" };
    if (categoryID) query.categoryID = categoryID;

    const posts = await Post.find(query)
      .populate("author", "name email")
      .populate("categoryID", "name slug")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
};

// Get Single Post
export const getPostBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const post = await Post.findOne({ slug })
      .populate("author", "name email")
      .populate("categoryID", "name slug");

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // Increment views
    post.views += 1;
    await post.save();

    res.json({
      success: true,
      post,
    });
  } catch (error) {
    next(error);
  }
};

// Update Post
export const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, categoryID, status, tags } = req.body;
    const userId = req.user.userId;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // Check authorization
    if (post.author.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (title) {
      post.title = title;
      post.slug = generateSlug(title);
    }
    if (content) post.content = content;
    if (excerpt) post.excerpt = excerpt;
    if (categoryID) post.categoryID = categoryID;
    if (status) post.status = status;
    if (tags) post.tags = tags;

    await post.save();

    res.json({
      success: true,
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Post
export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // Check authorization
    if (post.author.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Update category post count
    const category = await Category.findById(post.categoryID);
    if (category) {
      category.postCount -= 1;
      await category.save();
    }

    await Post.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get Admin Posts
export const getAdminPosts = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;

    const posts = await Post.find({ author: userId })
      .populate("categoryID", "name")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Post.countDocuments({ author: userId });

    res.json({
      success: true,
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createPost,
  getAllPosts,
  getPostBySlug,
  updatePost,
  deletePost,
  getAdminPosts,
};
