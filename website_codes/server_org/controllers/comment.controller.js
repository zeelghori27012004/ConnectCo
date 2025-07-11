import {
  addCommentService,
  getBlogCommentsService,
  getCommentRepliesService,
  deleteCommentService
} from "../services/comment.service.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

export const addComment = async (req, res) => {
  try {
    const user_id = req.user;
    const commentData = { ...req.body, user_id };
    const result = await addCommentService(commentData);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBlogComments = async (req, res) => {
  try {
    const { blog_id, skip } = req.body;
    const comments = await getBlogCommentsService(blog_id, skip);
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getReplies = async (req, res) => {
  try {
    const { _id, skip } = req.body;
    const replies = await getCommentRepliesService(_id, skip);
    res.status(200).json({ replies });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const user_id = req.user;
    const { _id } = req.body;
    await deleteCommentService(_id, user_id);
    res.status(200).json({ status: "done" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};