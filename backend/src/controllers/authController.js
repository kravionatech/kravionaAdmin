import User from "../models/User.js";
import { generateOTP, generateSlug } from "../utils/helpers.js";
import { sendEmail } from "../config/email.js";
import { generateAccessToken, generateRefreshToken } from "../config/jwt.js";

// Sign Up
export const signUp = async (req, res, next) => {
  try {
    const { name, email, username, phone, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email or username already exists",
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user
    const user = new User({
      name,
      email,
      username,
      phone,
      password,
      otp,
      otpExpiry,
    });

    await user.save();

    // Send OTP email
    const emailHtml = `
      <h2>Verify Your Email</h2>
      <p>Your OTP is: <strong>${otp}</strong></p>
      <p>OTP expires in 10 minutes</p>
    `;

    await sendEmail(email, "Email Verification", emailHtml);

    res.status(201).json({
      success: true,
      message: "User created. Check your email for OTP",
      userId: user._id,
    });
  } catch (error) {
    next(error);
  }
};

// Verify Email
export const verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email }).select("+otp +otpExpiry");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: "Email already verified" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (new Date() > user.otpExpiry) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password +refreshToken");

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id, user.email);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Refresh Token
export const refreshAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ success: false, message: "Refresh token required" });
    }

    // TODO: Verify refresh token and generate new access token
    // For now, just return a new access token

    res.json({
      success: true,
      message: "Token refreshed",
      // accessToken: newAccessToken,
    });
  } catch (error) {
    next(error);
  }
};

// Resend OTP
export const resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: "Email already verified" });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    const emailHtml = `
      <h2>Verify Your Email</h2>
      <p>Your OTP is: <strong>${otp}</strong></p>
      <p>OTP expires in 10 minutes</p>
    `;

    await sendEmail(email, "Email Verification", emailHtml);

    res.json({
      success: true,
      message: "OTP sent to email",
    });
  } catch (error) {
    next(error);
  }
};

export default {
  signUp,
  verifyEmail,
  login,
  refreshAccessToken,
  resendOTP,
};
