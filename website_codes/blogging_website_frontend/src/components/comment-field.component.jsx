import { useContext, useState } from "react";
import { UserContext } from "../App";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { BlogContext } from "../pages/blog.page";

const CommentField = ({
  action,
  index = undefined,
  replyingTo = undefined,
  setReplying,
}) => {
  // Access blog data
  let {
    blog,
    blog: {
      _id,
      author: { _id: blog_author },
      comments,
      comments: { results: commentsArr },
      activity,
      activity: { total_comments, total_parent_comments },
    },
    setBlog,
    setTotalParentCommentsLoaded,
  } = useContext(BlogContext);

  // Access user data
  let {
    userAuth: { access_token, username, fullname, profile_img },
  } = useContext(UserContext);

  // State for comment
  const [comment, setComment] = useState("");

  const handleComment = () => {
    if (!access_token) {
      // Prompt login
      return toast.error("login first to leave a comment");
    }

    if (!comment.length) {
      // Check empty comment
      return toast.error("Write something to leave a comment....");
    }

    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/add-comment",
        {
          _id,
          blog_author,
          comment,
          replying_to: replyingTo,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then(({ data }) => {
        // Reset comment field
        setComment("");

        data.commented_by = {
          personal_info: { username, profile_img, fullname },
        };

        let newCommentArr;

        if (replyingTo) {
          // Add reply
          commentsArr[index].children.push(data._id);

          data.childrenLevel = commentsArr[index].childrenLevel + 1;
          data.parentIndex = index;

          commentsArr[index].isReplyLoaded = true;

          commentsArr.splice(index + 1, 0, data);

          newCommentArr = commentsArr;

          setReplying(false);
        } else {
          // Add parent comment
          data.childrenLevel = 0;

          newCommentArr = [data, ...commentsArr];
        }

        let parentCommentIncrementval = replyingTo ? 0 : 1;

        // Update blog data
        setBlog({
          ...blog,
          comments: { ...comments, results: newCommentArr },
          activity: {
            ...activity,
            total_comments: total_comments + 1,
            total_parent_comments:
              total_parent_comments + parentCommentIncrementval,
          },
        });

        setTotalParentCommentsLoaded(
          (preVal) => preVal + parentCommentIncrementval
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      {/* Display toaster notifications */}
      <Toaster />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Leave a comment..."
        className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto"
      ></textarea>
      <button className="btn-dark mt-5 px-10" onClick={handleComment}>
        {action}
      </button>
    </>
  );
};

export default CommentField;
