import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  personal_info: {
    fullname: {
      type: String,
      required: true,
      minlength: [3, "Fullname must be at least 3 letters long"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Email is invalid"],
    },
    password: String,
    username: {
      type: String,
      unique: true,
    },
    bio: {
      type: String,
      maxlength: [150, "Bio should not be more than 150 characters"],
      default: "",
    },
    profile_img: String,
  },
  social_links: {
    youtube: String,
    instagram: String,
    facebook: String,
    twitter: String,
    github: String,
    website: String,
  },
  account_info: {
    total_posts: {
      type: Number,
      default: 0,
    },
    total_reads: {
      type: Number,
      default: 0,
    },
  },
  google_auth: {
    type: Boolean,
    default: false,
  },
  blogs: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "blogs",
    default: [],
  },
}, { timestamps: true });

export default mongoose.model("users", userSchema);