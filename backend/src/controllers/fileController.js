import File from "../models/File.js";
import cloudinary from "../config/cloudinary.js";

// Upload File
export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const userId = req.user.userId;

    // Upload to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        public_id: `kraviona/${Date.now()}-${req.file.originalname}`,
      },
      async (error, result) => {
        if (error) {
          return res.status(500).json({ success: false, message: "Upload failed", error });
        }

        // Save to database
        const file = new File({
          filename: req.file.originalname,
          fileUrl: result.secure_url,
          publicId: result.public_id,
          fileSize: req.file.size,
          mimeType: req.file.mimetype,
          uploadedBy: userId,
          fileType: result.resource_type === "image" ? "image" : "document",
        });

        await file.save();

        res.status(201).json({
          success: true,
          message: "File uploaded successfully",
          file,
        });
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (error) {
    next(error);
  }
};

// Get All Files
export const getAllFiles = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;

    const files = await File.find({ uploadedBy: userId })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await File.countDocuments({ uploadedBy: userId });

    res.json({
      success: true,
      files,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
};

// Delete File
export const deleteFile = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    // Check authorization
    if (file.uploadedBy.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(file.publicId);

    // Delete from database
    await File.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export default {
  uploadFile,
  getAllFiles,
  deleteFile,
};
