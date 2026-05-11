import Category from "../models/Category.js";
import { generateSlug } from "../utils/helpers.js";

// Create Category
export const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const userId = req.user.userId;

    const slug = generateSlug(name);

    // Check if category already exists
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = new Category({
      name,
      slug,
      description: description || "",
      createdBy: userId,
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Categories (Public)
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

// Get Single Category
export const getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const category = await Category.findOne({ slug });

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};

// Update Category
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    if (name) {
      category.name = name;
      category.slug = generateSlug(name);
    }
    if (description) category.description = description;

    await category.save();

    res.json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Category
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    await Category.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createCategory,
  getAllCategories,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
};
