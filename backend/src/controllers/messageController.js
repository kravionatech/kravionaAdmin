import Message from "../models/Message.js";
import { sendEmail } from "../config/email.js";

// Send Message
export const sendMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    const newMessage = new Message({
      name,
      email,
      subject,
      message,
    });

    await newMessage.save();

    // Send confirmation email to user
    const userEmailHtml = `
      <h2>Message Received</h2>
      <p>Hi ${name},</p>
      <p>Thank you for contacting us. We have received your message and will respond soon.</p>
    `;

    await sendEmail(email, "Message Received", userEmailHtml);

    // Send notification to admin
    const adminEmailHtml = `
      <h2>New Contact Message</h2>
      <p><strong>From:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong> ${message}</p>
    `;

    await sendEmail(process.env.SUPPORT_EMAIL, "New Contact Message", adminEmailHtml);

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get All Messages (Admin only)
export const getAllMessages = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    let query = {};
    if (status) query.status = status;

    const messages = await Message.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Message.countDocuments(query);

    res.json({
      success: true,
      messages,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
};

// Get Single Message
export const getMessageById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    // Mark as read
    if (message.status === "new") {
      message.status = "read";
      await message.save();
    }

    res.json({
      success: true,
      message,
    });
  } catch (error) {
    next(error);
  }
};

// Reply to Message
export const replyToMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    message.reply = reply;
    message.status = "replied";
    message.repliedAt = new Date();
    await message.save();

    // Send reply email
    const emailHtml = `
      <h2>Reply from Kraviona</h2>
      <p>Hi ${message.name},</p>
      <p><strong>Your Message:</strong> ${message.message}</p>
      <p><strong>Our Reply:</strong></p>
      <p>${reply}</p>
    `;

    await sendEmail(message.email, `Re: ${message.subject}`, emailHtml);

    res.json({
      success: true,
      message: "Reply sent successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Delete Message
export const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;

    const message = await Message.findById(id);

    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    await Message.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export default {
  sendMessage,
  getAllMessages,
  getMessageById,
  replyToMessage,
  deleteMessage,
};
