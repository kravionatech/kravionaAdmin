import express from "express";
import {
  signUp,
  verifyEmail,
  login,
  resendOTP,
} from "../controllers/authController.js";
import { validateSignUp, validateLogin, validateOTP, handleValidationErrors } from "../validators/index.js";

const router = express.Router();

// Sign Up
router.post("/create-account", validateSignUp, handleValidationErrors, signUp);

// Verify Email
router.post("/verify-account", validateOTP, handleValidationErrors, verifyEmail);

// Resend OTP
router.post("/resend-otp", resendOTP);

// Login
router.post("/login-password", validateLogin, handleValidationErrors, login);

export default router;
