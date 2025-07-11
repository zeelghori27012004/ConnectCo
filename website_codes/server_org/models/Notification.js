import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["like", "comment", "reply"],
    required: true
  },
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "blogs",
    required: true
  },
  notification_for: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "comments"
  },
  replied_on_comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "comments"
  },
  reply: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "comments"
  },
  seen: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model("notifications", notificationSchema);