import Subscriber from "../models/Subscriber.js";
import { sendEmail } from "../config/email.js";

// Subscribe to Newsletter
export const subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Check if already subscribed
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber && existingSubscriber.isActive) {
      return res.status(400).json({
        success: false,
        message: "Already subscribed with this email",
      });
    }

    if (existingSubscriber && !existingSubscriber.isActive) {
      existingSubscriber.isActive = true;
      await existingSubscriber.save();

      return res.json({
        success: true,
        message: "Subscription reactivated",
      });
    }

    const subscriber = new Subscriber({ email });
    await subscriber.save();

    // Send welcome email
    const emailHtml = `
      <h2>Welcome to Kraviona Newsletter!</h2>
      <p>Thank you for subscribing to our newsletter.</p>
      <p>You'll now receive updates about our latest posts and offers.</p>
    `;

    await sendEmail(email, "Newsletter Subscription", emailHtml);

    res.status(201).json({
      success: true,
      message: "Subscribed successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Unsubscribe
export const unsubscribe = async (req, res, next) => {
  try {
    const { email } = req.body;

    const subscriber = await Subscriber.findOne({ email });

    if (!subscriber) {
      return res.status(404).json({ success: false, message: "Subscriber not found" });
    }

    subscriber.isActive = false;
    await subscriber.save();

    res.json({
      success: true,
      message: "Unsubscribed successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get All Subscribers (Admin only)
export const getAllSubscribers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const subscribers = await Subscriber.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Subscriber.countDocuments();

    res.json({
      success: true,
      subscribers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  subscribe,
  unsubscribe,
  getAllSubscribers,
};
