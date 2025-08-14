import Blog from "../models/Blog.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { nanoid } from "nanoid";
import { 
  MAX_BLOG_LIMIT, 
  BLOG_DESCRIPTION_LIMIT,
  MAX_TAGS_LIMIT
} from "../utils/constants.js";

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

export const getBlogCountByQuery = async ({ tag, author, query }) => {
  let findQuery;

  if (tag) {
    findQuery = { tags: tag, draft: false };
  } else if (query) {
    findQuery = { draft: false, title: new RegExp(query, "i") };
  } else if (author) {
    findQuery = { author, draft: false };
  }

  return await Blog.countDocuments(findQuery);
};

export const createBlogService = async (authorId, { title, des, banner, tags, content, draft, id }) => {
  if (!title.length) {
    throw new Error("You must provide a title");
  }

  if (!draft) {
    if (!des.length || des.length > BLOG_DESCRIPTION_LIMIT) {
      throw new Error(`You must provide blog description under ${BLOG_DESCRIPTION_LIMIT} characters`);
    }
    if (!banner.length) {
      throw new Error("You must provide blog banner to publish it");
    }
    if (!content.blocks.length) {
      throw new Error("There must be some blog content to publish it");
    }
    if (!tags.length || tags.length > MAX_TAGS_LIMIT) {
      throw new Error(`Provide tags in order to publish the blog, Maximum ${MAX_TAGS_LIMIT}`);
    }
  }

  const processedTags = tags.map(tag => tag.toLowerCase());
  const blog_id = id || title
    .replace(/[^a-zA-Z0-9]/g, " ")
    .replace(/\s+/g, "-")
    .trim() + nanoid();

  if (id) {
    await Blog.findOneAndUpdate(
      { blog_id },
      { title, des, banner, content, tags: processedTags, draft: Boolean(draft) }
    );
    return blog_id;
  } else {
    const blog = new Blog({
      title,
      des,
      banner,
      content,
      tags: processedTags,
      author: authorId,
      blog_id,
      draft: Boolean(draft),
    });

    const savedBlog = await blog.save();
    const incrementVal = draft ? 0 : 1;

    await User.findOneAndUpdate(
      { _id: authorId },
      {
        $inc: { "account_info.total_posts": incrementVal },
        $push: { blogs: savedBlog._id },
      }
    );

    return blog_id;
  }
};

export const getBlogById = async (blog_id, draft, incrementRead) => {
  const incrementVal = incrementRead ? 1 : 0;

  const blog = await Blog.findOneAndUpdate(
    { blog_id },
    { $inc: { "activity.total_reads": incrementVal } }
  )
    .populate("author", "personal_info.fullname personal_info.username personal_info.profile_img")
    .select("title des content banner activity publishedAt blog_id tags draft");

  if (incrementRead) {
    await User.findOneAndUpdate(
      { "personal_info.username": blog.author.personal_info.username },
      { $inc: { "account_info.total_reads": 1 } }
    );
  }

  return blog;
};

export const likeBlogService = async (user_id, _id, islikedByUser) => {
  const incrementVal = islikedByUser ? -1 : 1;
  const blog = await Blog.findOneAndUpdate(
    { _id },
    { $inc: { "activity.total_likes": incrementVal } }
  );

  if (!islikedByUser) {
    const like = new Notification({
      type: "like",
      blog: _id,
      notification_for: blog.author,
      user: user_id,
    });
    await like.save();
    return { liked_by_user: true };
  } else {
    await Notification.findOneAndDelete({ user: user_id, blog: _id, type: "like" });
    return { liked_by_user: false };
  }
};

export const isBlogLikedByUser = async (user_id, _id) => {
  return await Notification.exists({ user: user_id, type: "like", blog: _id });
};

export const getUserBlogsService = async (user_id, page, draft, query, deletedDocCount) => {
  const maxLimit = 5;
  let skipDocs = (page - 1) * maxLimit;

  if (deletedDocCount) {
    skipDocs -= deletedDocCount;
  }

  return await Blog.find({ 
    author: user_id, 
    draft, 
    title: new RegExp(query, "i") 
  })
    .skip(skipDocs)
    .limit(maxLimit)
    .sort({ publishedAt: -1 })
    .select("title banner publishedAt blog_id activity des draft -_id");
};

export const getUserBlogsCountService = async (user_id, draft, query) => {
  return await Blog.countDocuments({ 
    author: user_id, 
    draft, 
    title: new RegExp(query, "i") 
  });
};

export const deleteBlogService = async (user_id, blog_id) => {
  const blog = await Blog.findOneAndDelete({ blog_id });
  
  await Promise.all([
    Notification.deleteMany({ blog: blog._id }),
    Comment.deleteMany({ blog_id: blog._id }),
    User.findOneAndUpdate(
      { _id: user_id },
      { $pull: { blogs: blog._id }, $inc: { "account_info.total_posts": -1 } }
    )
  ]);
};