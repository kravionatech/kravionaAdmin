import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    mimeType: {
      type: String,
      default: "image/jpeg",
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileType: {
      type: String,
      enum: ["image", "document", "video"],
      default: "image",
    },
  },
  { timestamps: true }
);

const File = mongoose.model("File", fileSchema);

export default File;
