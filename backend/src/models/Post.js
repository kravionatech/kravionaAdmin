import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a post title"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, "Please provide post content"],
    },
    excerpt: {
      type: String,
      required: [true, "Please provide an excerpt"],
    },
    featuredImage: {
      type: String,
      default: null,
    },
    categoryID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    views: {
      type: Number,
      default: 0,
    },
    tags: [String],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
