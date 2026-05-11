import { body, validationResult } from "express-validator";

export const validateSignUp = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("username").notEmpty().withMessage("Username is required"),
  body("phone").notEmpty().withMessage("Phone number is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

export const validateLogin = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const validateOTP = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("otp").notEmpty().withMessage("OTP is required"),
];

export const validatePost = [
  body("title").notEmpty().withMessage("Title is required"),
  body("slug").notEmpty().withMessage("Slug is required"),
  body("content").notEmpty().withMessage("Content is required"),
  body("excerpt").notEmpty().withMessage("Excerpt is required"),
  body("categoryID").notEmpty().withMessage("Category ID is required"),
];

export const validateCategory = [
  body("name").notEmpty().withMessage("Category name is required"),
  body("slug").notEmpty().withMessage("Slug is required"),
];

export const validateSubscriber = [
  body("email").isEmail().withMessage("Valid email is required"),
];

export const validateMessage = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("subject").notEmpty().withMessage("Subject is required"),
  body("message").notEmpty().withMessage("Message is required"),
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

export default {
  validateSignUp,
  validateLogin,
  validateOTP,
  validatePost,
  validateCategory,
  validateSubscriber,
  validateMessage,
  handleValidationErrors,
};
