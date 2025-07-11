import Comment from "../models/Comment.js";
import Blog from "../models/Blog.js";
import Notification from "../models/Notification.js";
import { MAX_COMMENT_LIMIT } from "../utils/constants.js";

const deleteCommentNested = async (_id) => {
  const comment = await Comment.findOneAndDelete({ _id });
  
  if (comment.parent) {
    await Comment.findOneAndUpdate(
      { _id: comment.parent },
      { $pull: { children: _id } }
    );
  }

  await Notification.findOneAndDelete({ comment: _id });
  await Notification.findOneAndUpdate(
    { reply: _id },
    { $unset: { reply: 1 } }
  );

  await Blog.findOneAndUpdate(
    { _id: comment.blog_id },
    {
      $pull: { comments: _id },
      $inc: { 
        "activity.total_comments": -1,
        "activity.total_parent_comments": comment.parent ? 0 : -1 
      },
    }
  );

  if (comment.children.length) {
    await Promise.all(comment.children.map(replies => deleteCommentNested(replies)));
  }
};

export const addCommentService = async ({ _id, comment, blog_author, user_id, replying_to, notification_id }) => {
  const commentObj = {
    blog_id: _id,
    blog_author,
    comment,
    commented_by: user_id,
    ...(replying_to && { parent: replying_to, isReply: true })
  };

  const commentFile = await new Comment(commentObj).save();

  await Blog.findOneAndUpdate(
    { _id },
    {
      $push: { comments: commentFile._id },
      $inc: {
        "activity.total_comments": 1,
        "activity.total_parent_comments": replying_to ? 0 : 1,
      },
    }
  );

  const notificationObj = {
    type: replying_to ? "reply" : "comment",
    blog: _id,
    notification_for: blog_author,
    user: user_id,
    comment: commentFile._id,
    ...(replying_to && { replied_on_comment: replying_to })
  };

  if (replying_to) {
    const replyingToCommentDoc = await Comment.findOneAndUpdate(
      { _id: replying_to },
      { $push: { children: commentFile._id } }
    );
    notificationObj.notification_for = replyingToCommentDoc.commented_by;

    if (notification_id) {
      await Notification.findOneAndUpdate(
        { _id: notification_id },
        { reply: commentFile._id }
      );
    }
  }

  await new Notification(notificationObj).save();

  return {
    comment: commentFile.comment,
    commentedAt: commentFile.commentedAt,
    _id: commentFile._id,
    user_id,
    children: commentFile.children
  };
};

export const getBlogCommentsService = async (blog_id, skip) => {
  return await Comment.find({ blog_id, isReply: false })
    .populate("commented_by", "personal_info.username personal_info.fullname personal_info.profile_img")
    .skip(skip)
    .limit(MAX_COMMENT_LIMIT)
    .sort({ commentedAt: -1 });
};

export const getCommentRepliesService = async (_id, skip) => {
  const doc = await Comment.findOne({ _id })
    .populate({
      path: "children",
      options: {
        limit: MAX_COMMENT_LIMIT,
        skip: skip,
        sort: { commentedAt: -1 },
      },
      populate: {
        path: "commented_by",
        select: "personal_info.profile_img personal_info.fullname personal_info.username",
      },
      select: "-blog_id -updatedAt",
    })
    .select("children");
  
  return doc.children;
};

export const deleteCommentService = async (_id, user_id) => {
  const comment = await Comment.findOne({ _id });
  
  if (user_id != comment.commented_by && user_id != comment.blog_author) {
    throw new Error("You can not delete this comment");
  }

  await deleteCommentNested(_id);
};