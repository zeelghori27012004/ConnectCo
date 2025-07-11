import Blog from "../models/Blog.js";
import User from "../models/User.js";
import { MAX_BLOG_LIMIT } from "../utils/constants.js";

export const getLatestBlogs = async (page) => {
  return await Blog.find({ draft: false })
    .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
    .sort({ publishedAt: -1 })
    .select("blog_id title des banner activity tags publishedAt -_id")
    .skip((page - 1) * MAX_BLOG_LIMIT)
    .limit(MAX_BLOG_LIMIT);
};

export const getBlogCount = async () => {
  return await Blog.countDocuments({ draft: false });
};

export const getTrendingBlogs = async () => {
  return await Blog.find({ draft: false })
    .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
    .sort({ "activity.total_read": -1, "activity.total_likes": -1, publishedAt: -1 })
    .select("blog_id title publishedAt -_id")
    .limit(5);
};

export const searchBlogs = async (query) => {
  const { tag, query: searchQuery, author, page, limit, eliminate_blog } = query;
  let findQuery;

  if (tag) {
    findQuery = { tags: tag, draft: false, blog_id: { $ne: eliminate_blog } };
  } else if (searchQuery) {
    findQuery = { draft: false, title: new RegExp(searchQuery, "i") };
  } else if (author) {
    findQuery = { author, draft: false };
  }

  const maxLimit = limit ? limit : 2;

  return await Blog.find(findQuery)
    .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
    .sort({ publishedAt: -1 })
    .select("blog_id title des banner activity tags publishedAt -_id")
    .skip((page - 1) * maxLimit)
    .limit(maxLimit);
};