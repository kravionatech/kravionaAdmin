import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    subject: {
      type: String,
      required: [true, "Please provide a subject"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Please provide a message"],
    },
    status: {
      type: String,
      enum: ["new", "read", "replied"],
      default: "new",
    },
    reply: {
      type: String,
      default: null,
    },
    repliedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
