import express from "express";
import {
  latestBlogs,
  allLatestBlogsCount,
  trendingBlogs,
  searchBlogsController,
  searchBlogsCount,
  createBlog,
  getBlog,
  likeBlog,
  isLikedByUser,
  getUserBlogs,
  getUserBlogsCount,
  deleteBlog
} from "../controllers/blog.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/latest-blogs", latestBlogs);
router.post("/all-latest-blogs-count", allLatestBlogsCount);
router.get("/trending-blogs", trendingBlogs);
router.post("/search-blogs", searchBlogsController);
router.post("/search-blogs-count", searchBlogsCount);
router.post("/create-blog", verifyJWT, createBlog);
router.post("/get-blog", getBlog);
router.post("/like-blog", verifyJWT, likeBlog);
router.post("/isliked-by-user", verifyJWT, isLikedByUser);
router.post("/user-written-blogs", verifyJWT, getUserBlogs);
router.post("/user-written-blogs-count", verifyJWT, getUserBlogsCount);
router.post("/delete-blog", verifyJWT, deleteBlog);

export default router;