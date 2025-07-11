import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  banner: String,
  des: {
    type: String,
    maxlength: 200,
  },
  content: {
    type: Array,
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  draft: {
    type: Boolean,
    default: false,
  },
  blog_id: {
    type: String,
    required: true,
    unique: true,
  },
  activity: {
    total_likes: {
      type: Number,
      default: 0,
    },
    total_comments: {
      type: Number,
      default: 0,
    },
    total_reads: {
      type: Number,
      default: 0,
    },
    total_parent_comments: {
      type: Number,
      default: 0,
    },
  },
  comments: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "comments",
    default: [],
  },
}, { timestamps: { createdAt: "publishedAt" } });

export default mongoose.model("blogs", blogSchema);