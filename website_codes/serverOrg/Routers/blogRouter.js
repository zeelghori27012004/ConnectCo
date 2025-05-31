import { all_latest_blogs_count, latest_blogs, search_blogs, search_blogs_count, trending_blogs, create_blog, get_blog, like_blog,isliked_by_user, get_blog_comments, add_comment, get_replies, delete_comment, delete_blog, get_upload_url, search_users } from "../Controllers/blogController.js";
import  {verifyJWT}  from "../Middlewares/authMiddleware.js";
import express from "express";

const router = express.Router();

router.post("/latest-blogs",latest_blogs);
router.get("/trending-blogs",trending_blogs);
router.post("/search-blogs",search_blogs);
router.post("/all-latest-blogs-count",all_latest_blogs_count);
router.post("/search-blogs-count",search_blogs_count);
router.post("/search-users",search_users);
router.post("/create-blog", verifyJWT, create_blog);
router.post("/get-blog",get_blog);
router.post("/like-blog", verifyJWT, like_blog);
router.post("/isliked-by-user", verifyJWT, isliked_by_user);
router.post("/get-blog-comments", get_blog_comments);
router.post("/add-comment", verifyJWT, add_comment);
router.post("/get-replies",get_replies);
router.post("/delete-comment", verifyJWT,delete_comment);
router.post("/delete-blog", verifyJWT, delete_blog);
router.get("/get-upload-url",get_upload_url);

export default router;