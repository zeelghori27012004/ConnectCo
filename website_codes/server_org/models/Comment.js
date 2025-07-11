import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  blog_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "blogs",
    required: true
  },
  blog_author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  children: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "comments",
    default: []
  },
  commented_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  isReply: {
    type: Boolean,
    default: false
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "comments"
  }
}, { timestamps: true });

export default mongoose.model("comments", commentSchema);