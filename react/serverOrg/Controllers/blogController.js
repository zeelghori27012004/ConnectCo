import User from "../Schema/User.js";
import Notification from "../Schema/Notification.js";
import Blog from "../Schema/Blog.js";
import Comment from "../Schema/Comment.js";
import { deleteComments,generateUploadURL } from "../Services/blogService.js";
import { nanoid } from 'nanoid';


export const latest_blogs = async (req, res) => {
    
    let { page } = req.body ; 
    
    let maxLimit = 5; // Maximum number of blogs to return

    Blog.find({ draft: false }) // Filter out drafts
    .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id") // Include author details
    .sort({ "publishedAt": -1 }) // Sort by the latest publish date
    .select("blog_id title des banner activity tags publishedAt -_id") // Select only required fields
    .skip((page-1)*maxLimit)
    .limit(maxLimit) // Limit results
    .then(blogs => res.status(200).json({ blogs })) // Return blogs in response
    .catch(err => res.status(500).json({ error: err.message })); // Handle errors
};

export const trending_blogs = async(req,res) => {

    Blog.find({ draft: false }) // Filter out drafts
    .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id") // Include author details
    .sort({ "activity.total_read": -1, "activity.total_likes": -1, "publishedAt": -1 })
    .select("blog_id title publishedAt -_id") // Select only required fields
    .limit(5) // Limit results
    .then(blogs => res.status(200).json({ blogs })) // Return blogs in response
    .catch(err => res.status(500).json({ error: err.message })); // Handle errors
};

// Search blogs by tag, query, or author
export const search_blogs = async(req, res) => {

    let { tag, query, author, page, limit, eliminate_blog } = req.body; // Extract search parameters

    // Determine the query conditions dynamically based on provided parameters
    let findQuery = { draft: false };

    if(tag){   // Filter by tags
        findQuery.tags = tag; // Match a single tag
    } 
    
    else if(query){     // Search by queries given
        findQuery = { draft: false, title: new RegExp(query, 'i') } 
    } 
    
    else if(author) {    // Search by Author
        findQuery = { author, draft: false }
    }

    if (eliminate_blog) {
        findQuery.blog_id = { $ne: eliminate_blog }; // Exclude the specified blog ID
    }

    let maxLimit = limit ? limit : 2; // Default to 2 results per page if no limit is provided

    Blog.find(findQuery)
    .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id") // Include author details
    .sort({ "publishedAt": -1 }) // Sort by latest publish date
    .select("blog_id title des banner activity tags publishedAt -_id") // Select only required fields
    .skip((page - 1) * maxLimit) // Skip for pagination
    .limit(maxLimit) // Limit results
    .then(blogs => res.status(200).json({ blogs })) // Return blogs in response
    .catch(err => res.status(500).json({ error: err.message })); // Handle errors
};

export const all_latest_blogs_count = async(req, res) => {

    Blog.countDocuments({ draft: false }) // Count non-draft blogs
    .then(count => {
            return res.status(200).json({ totalDocs: count }); // Return the total count of blogs
    })
    .catch(err => {
            console.log(err.message); // Log error to the console
            return res.status(500).json({ error: err.message }); // Return error response
    });
};

export const search_blogs_count = async (req, res) => {

    let { tag, author, query } = req.body; // Extract search parameters

    let findQuery = { draft: false }; // Initialize the query object

    // Build the search query dynamically based on provided parameters
    if(tag){   // Filter by tags
        findQuery.tags = tag; // Match a single tag
    } 

    else if (query) {
        findQuery = { draft: false, title: new RegExp(query, 'i') }; // Search by query in titles
    }

    else if (author) {
        findQuery = { author, draft: false }; // Filter by author
    }

    // Count the number of documents matching the search query
    Blog.countDocuments(findQuery)
    .then(count => {
            return res.status(200).json({ totalDocs: count }); // Return the total count of blogs
    })
    .catch(err => {
            console.log(err.message); // Log the error message to the console
            return res.status(500).json({ error: err.message }); // Return error response
    });
};

export const search_users = async (req, res) => {

    let { query } = req.body;

    User.find({ "personal_info.username": new RegExp(query, 'i') })
    .limit(50)
    .select("personal_info.fullname personal_info.username personal_info.profile_img -_id")
    .then(users => {
        return res.status(200).json({ users })
    })
    .catch(err => {
        return res.status(500).json({ error: err.message })
    })

};


export const create_blog = async(request, response) => {

    let authorId = request.user;

    let { title, des, banner, tags, content, draft, id } = request.body

    if (!title.length) {
        return response.status(403).json({ error: "Provide a title" })
    }

    if (!draft) {
        if (!des.length || des.length > 200) {
            return response.status(403).json({ error: "Provide a description in maximum of 200 characters" })
        }

        if (!banner.length) {
            return response.status(403).json({ error: "Provide a blog image" })
        }

        if (!content.blocks.length) {
            return response.status(403).json({ error: "Provide some blog content" })
        }

        if (!tags.length || tags.length > 7) {
            return response.status(403).json({ error: "Select some relatable tags, at max 7" })
        }
    }

    tags = tags.map(tag => tag.toLowerCase());

    let blog_id = id || title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, '-').trim() + nanoid();
    console.log(blog_id);

    if(id){
        Blog.findOneAndUpdate({ blog_id }, { title, des, banner, content, tags, draft: draft ? draft : false })
        .then(() => {
            return response.status(200).json({ id: blog_id })
        })
        .catch(err => {
            return response.status(500).json({ error: err.message })
        })
    } else {
        let blog = new Blog({
            title, des, banner, content, tags, author: authorId, blog_id, draft: Boolean(draft)
        })
    
        blog.save().then(blog => {
    
            let incrementVal = draft ? 0 : 1;
    
            User.findOneAndUpdate({ _id: authorId }, { $inc: { "account_info.total_posts": incrementVal }, $push: { "blogs": blog._id } })
                .then(user => {
                    return response.status(200).json({ id: blog.blog_id })
                })
                .catch(err => {
                    return response.status(500).json({ error: "Failed to update post count" })
                })
        })
        .catch(err => {
            return response.status(500).json({ error: err.message })
        })
    }
};

export const get_blog = async (req, res) => {

    let { blog_id, draft, mode } = req.body;

    let incrementVal = mode != 'edit' ? 1 : 0;

    Blog.findOneAndUpdate({ blog_id }, { $inc : { "activity.total_reads": incrementVal } })
    .populate("author", "personal_info.fullname personal_info.username personal_info.profile_img")
    .select("title des content banner activity publishedAt blog_id tags")
    .then(blog => {

        User.findOneAndUpdate({ "personal_info.username": blog.author.personal_info.username }, { 
            $inc : { "account_info.total_reads": incrementVal }
        })
        .catch(err => {
            return res.status(500).json({ error: err.message })
        })

        if(blog.draft && !draft){
            return res.status(500).json({ error: 'you can not access draft blogs' })
        }

        return res.status(200).json({ blog });

    })
    .catch(err => {
        return res.status(500).json({ error: err.message });
    })

};

export const like_blog= async(req, res) => {

    let user_id = req.user;

    let { _id, islikedByUser } = req.body;

    let incrementVal = !islikedByUser ? 1 : -1;

    Blog.findOneAndUpdate({ _id }, { $inc: { "activity.total_likes": incrementVal } })
    .then(blog => {

        if(!islikedByUser){
            let like = new Notification({
                type: "like",
                blog: _id,
                notification_for: blog.author,
                user: user_id
            })

            like.save().then(notification => {
                return res.status(200).json({ liked_by_user: true })
            })
        } else{

            Notification.findOneAndDelete({ user: user_id, blog: _id, type: "like" })
            .then(data => {
                return res.status(200).json({ liked_by_user: false })
            })
            .catch(err => {
                return res.status(500).json({ error: err.message });
            })

        }

    })

};

export const isliked_by_user = async (req, res) => {
    
    let user_id = req.user;

    let { _id } = req.body;

    Notification.exists({ user: user_id, type: "like", blog: _id })
    .then(result => {
        return res.status(200).json({ result }) 
    })
    .catch(err => {
        return res.status(500).json({ error: err.message })
    })

};

export const get_blog_comments= async(req, res) => {

    let { blog_id, skip } = req.body;

    let maxLimit = 5;

    Comment.find({ blog_id, isReply: false })
    .populate("commented_by", "personal_info.username personal_info.fullname personal_info.profile_img")
    .skip(skip)
    .limit(maxLimit)
    .sort({
        'commentedAt': -1
    })
    .then(comment => {
        console.log(comment, blog_id, skip)
        return res.status(200).json(comment);
    })
    .catch(err => {
        console.log(err.message);
        return res.status(500).json({ error: err.message })
    })

};

export const add_comment = async (req, res) => {

    let user_id = req.user;

    let { _id, comment, blog_author, replying_to, notification_id } = req.body;

    if(!comment.length) {
        return res.status(403).json({ error: 'Write something to leave a comment' });
    }

    // creating a comment doc
    let commentObj = {
        blog_id: _id, blog_author, comment, commented_by: user_id,
    }

    if(replying_to){
        commentObj.parent = replying_to;
        commentObj.isReply = true;
    }

    new Comment(commentObj).save().then(async commentFile => {

        let { comment, commentedAt, children } = commentFile;

        Blog.findOneAndUpdate({ _id }, { $push: { "comments": commentFile._id }, $inc : { "activity.total_comments": 1, "activity.total_parent_comments": replying_to ? 0 : 1 },  })
        .then(blog => { console.log('New comment created') });

        let notificationObj = {
            type: replying_to ? "reply" : "comment",
            blog: _id,
            notification_for: blog_author,
            user: user_id,
            comment: commentFile._id
        }

        if(replying_to){

            notificationObj.replied_on_comment = replying_to;

            await Comment.findOneAndUpdate({ _id: replying_to }, { $push: { children: commentFile._id } })
            .then(replyingToCommentDoc => { notificationObj.notification_for = replyingToCommentDoc.commented_by })

            if(notification_id){
                Notification.findOneAndUpdate({ _id: notification_id }, { reply: commentFile._id })
                .then(notificaiton => console.log('notification updated'))
            }

        }

        new Notification(notificationObj).save().then(notification => console.log('new notification created'));

        return res.status(200).json({
            comment, commentedAt, _id: commentFile._id, user_id, children
        })

    })


};


export const get_replies = async (req, res) => {

    let { _id, skip } = req.body;

    let maxLimit = 5;

    Comment.findOne({ _id })
    .populate({
        path: "children",
        options: {
            limit: maxLimit,
            skip: skip,
            sort: { 'commentedAt': -1 }
        },
        populate: {
            path: 'commented_by',
            select: "personal_info.profile_img personal_info.fullname personal_info.username"
        },
        select: "-blog_id -updatedAt"
    })
    .select("children")
    .then(doc => {
        console.log(doc);
        return res.status(200).json({ replies: doc.children })
    })
    .catch(err => {
        return res.status(500).json({ error: err.message })
    })

};

export const delete_comment = async(req, res) => {

    let user_id = req.user;

    let { _id } = req.body;

    Comment.findOne({ _id })
    .then(comment => {

        if( user_id == comment.commented_by || user_id == comment.blog_author ){

            deleteComments(_id)

            return res.status(200).json({ status: 'done' });

        } else{
            return res.status(403).json({ error: "You can not delete this comment" })
        }

    })

};

export const delete_blog = async (req, res) => {
    let user_id = req.user;
    let { blog_id } = req.body;

    Blog.findOneAndDelete({ blog_id })
    .then(blog => {
        Notification.deleteMany({ blog: blog._id }).then(data => console.log('Notifications Deleted'));
        Comment.deleteMany({ blog_id: blog._id }).then(data => console.log('Comments Deleted'));

        User.findOneAndUpdate({ _id: user_id }, { $pull: { blog: blog._id }, $inc: { "account_info.total_posts": -1 } })
        .then(user => console.log('Blog Deleted'));

        return res.status(200).json({ status:'Done' });
    })
    .catch(err => {
        return res.status(500).json({ error: err.message })
    })
};

export const get_upload_url = async(request, response) => {
    generateUploadURL().then(url => response.status(200).json({ uploadURL: url }))
        .catch(err => {
            console.log(err.message);
            return response.status(500).json({ error: err.message })
        })
};

