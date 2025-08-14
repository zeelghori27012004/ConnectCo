import {
  getLatestBlogs,
  getBlogCount,
  getTrendingBlogs,
  searchBlogs,
  getBlogCountByQuery,
  createBlogService,
  getBlogById,
  likeBlogService,
  isBlogLikedByUser,
  getUserBlogsService,
  getUserBlogsCountService,
  deleteBlogService
} from "../services/blog.service.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

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

export const searchBlogsCount = async (req, res) => {
  try {
    const { tag, author, query } = req.body;
    const count = await getBlogCountByQuery({ tag, author, query });
    res.status(200).json({ totalDocs: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createBlog = async (req, res) => {
  try {
    const authorId = req.user;
    const blogData = req.body;
    const blog_id = await createBlogService(authorId, blogData);
    res.status(200).json({ id: blog_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBlog = async (req, res) => {
  try {
    const { blog_id, draft, mode } = req.body;
    const blog = await getBlogById(blog_id, draft, mode !== "edit");
    
    if (blog.draft && !draft) {
      return res.status(403).json({ error: "You cannot access draft blogs" });
    }

    res.status(200).json({ blog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const likeBlog = async (req, res) => {
  try {
    const user_id = req.user;
    const { _id, islikedByUser } = req.body;
    const result = await likeBlogService(user_id, _id, islikedByUser);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const isLikedByUser = async (req, res) => {
  try {
    const user_id = req.user;
    const { _id } = req.body;
    const result = await isBlogLikedByUser(user_id, _id);
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserBlogs = async (req, res) => {
  try {
    const user_id = req.user;
    const { page, draft, query, deletedDocCount } = req.body;
    const blogs = await getUserBlogsService(user_id, page, draft, query, deletedDocCount);
    res.status(200).json({ blogs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserBlogsCount = async (req, res) => {
  try {
    const user_id = req.user;
    const { draft, query } = req.body;
    const count = await getUserBlogsCountService(user_id, draft, query);
    res.status(200).json({ totalDocs: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const user_id = req.user;
    const { blog_id } = req.body;
    await deleteBlogService(user_id, blog_id);
    res.status(200).json({ status: "done" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};