import {
  getLatestBlogs,
  getBlogCount,
  getTrendingBlogs,
  searchBlogs,
  getBlogCountByQuery,
  createBlog,
  getBlogById,
  likeBlog,
  deleteBlogById
} from "../services/blog.service.js";

export const latestBlogs = async (req, res) => {
  try {
    const { page } = req.body;
    const blogs = await getLatestBlogs(page);
    res.status(200).json({ blogs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const allLatestBlogsCount = async (req, res) => {
  try {
    const count = await getBlogCount();
    res.status(200).json({ totalDocs: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const trendingBlogs = async (req, res) => {
  try {
    const blogs = await getTrendingBlogs();
    res.status(200).json({ blogs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const searchBlogsController = async (req, res) => {
  try {
    const blogs = await searchBlogs(req.body);
    res.status(200).json({ blogs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};