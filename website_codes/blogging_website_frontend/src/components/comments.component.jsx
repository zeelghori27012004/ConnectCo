import { useContext } from "react";
import { BlogContext } from "../pages/blog.page";
import CommentField from "./comment-field.component";
import axios from "axios";
import NoDataMessage from "./nodata.component";
import AnimationWrapper from "../common/page-animation";
import CommentCard from "./comment-card.component";

// Function to fetch comments for a blog
export const fetchComments = async ({
  skip = 0, // Number of comments to skip
  blog_id, // ID of the blog
  setParentCommentCountFun, // Function to update parent comment count
  comment_array = null, // Existing comments array
}) => {
  let res;

  await axios
    .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog-comments", {
      blog_id,
      skip,
    })
    .then(({ data }) => {
      data.map((comment) => {
        comment.childrenLevel = 0; // Initialize comment's hierarchical level
      });

      setParentCommentCountFun((preVal) => preVal + data.length); // Update parent comments count

      if (comment_array == null) {
        res = { results: data }; // New comments fetched
      } else {
        res = { results: [...comment_array, ...data] }; // Append to existing comments
      }
    });

  return res;
};

const CommentsContainer = () => {
  let {
    blog, // Blog details
    blog: {
      _id, // Blog ID
      title, // Blog title
      comments: { results: commentsArr }, // Existing comments
      activity: { total_parent_comments }, // Total parent comments count
    },
    commentsWrapper, // State to toggle comments container visibility
    setCommentsWrapper, // Function to toggle comments container
    totalParentCommentsLoaded, // Number of parent comments loaded
    setTotalParentCommentsLoaded, // Function to update loaded parent comments count
    setBlog, // Function to update blog state
  } = useContext(BlogContext);

  // Function to load more comments
  const loadMoreComments = async () => {
    let newCommentsArr = await fetchComments({
      skip: totalParentCommentsLoaded,
      blog_id: _id,
      setParentCommentCountFun: setTotalParentCommentsLoaded,
      comment_array: commentsArr,
    });

    setBlog({ ...blog, comments: newCommentsArr }); // Update blog comments in state
  };

  return (
    <div
      className={
        "max-sm:w-full fixed " +
        (commentsWrapper ? "top-0 sm:right-0" : "top-[100%] sm:right-[-100%]") +
        " duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden"
      }
    >
      <div className="relative">
        <h1 className="text-xl font-medium">Comments</h1>
        <p className="text-lg mt-2 w-[70%] text-dark-grey line-clamp-1">
          {title} {/* Display the blog's title */}
        </p>

        <button
          onClick={() => setCommentsWrapper((preVal) => !preVal)}
          className="absolute top-0 right-0 flex justify-center items-center w-12 h-12 rounded-full bg-grey"
        >
          <i className="fi fi-br-cross text-2xl mt-1"></i>
        </button>
      </div>
      <hr className="border-grey my-8 w-[120%] -ml-10" />
      <CommentField action="comment" /> {/* Text area to add a comment */}
      {commentsArr && commentsArr.length ? (
        commentsArr.map((comment, i) => {
          return (
            <AnimationWrapper key={i}>
              <CommentCard
                index={i} // Pass comment index
                leftVal={comment.childrenLevel * 4} // Set left padding for nested comments
                commentData={comment} // Pass comment data
              />
            </AnimationWrapper>
          );
        })
      ) : (
        <NoDataMessage message="No Comments" /> // Display if no comments
      )}
      {total_parent_comments > totalParentCommentsLoaded ? (
        <button
          onClick={loadMoreComments}
          className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
        >
          Load More {/* Button to load additional comments */}
        </button>
      ) : (
        ""
      )}
    </div>
  );
};

export default CommentsContainer;
