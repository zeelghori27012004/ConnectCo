import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { getDay } from "../common/date";
import BlogInteraction from "../components/blog-interaction.component";
import BlogPostCard from "../components/blog-post.component";
import BlogContent from "../components/blog-content.component";
import CommentsContainer, {
  fetchComments,
} from "../components/comments.component";

export const blogStructure = {
  title: "",
  des: "",
  conent: [],
  author: { personal_info: {} },
  banner: "",
  publishedAt: "",
};

export const BlogContext = createContext({});

const BlogPage = () => {
  let { blog_id } = useParams(); // Get blog_id from URL params

  const [blog, setBlog] = useState(blogStructure); // Initialize blog state
  const [similarBlogs, setSimilrBlogs] = useState(null); // State for similar blogs
  const [loading, setLoading] = useState(true); // Loading state
  const [islikedByUser, setLikedByUser] = useState(false); // Like status
  const [commentsWrapper, setCommentsWrapper] = useState(false); // Comments section visibility
  const [totalParentCommentsLoaded, setTotalParentCommentsLoaded] = useState(0); // Total loaded comments

  let {
    title,
    content,
    banner,
    author: {
      personal_info: { fullname, username: author_username, profile_img },
    },
    publishedAt,
  } = blog; // Destructure blog data

  const fetchBlog = () => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", { blog_id }) // Fetch blog data
      .then(async ({ data: { blog } }) => {
        blog.comments = await fetchComments({
          blog_id: blog._id,
          setParentCommentCountFun: setTotalParentCommentsLoaded, // Fetch and set comments
        });
        setBlog(blog);

        axios
          .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
            tag: blog.tags[0],
            limit: 6,
            eliminate_blog: blog_id, // Fetch similar blogs
          })
          .then(({ data }) => {
            setSimilrBlogs(data.blogs); // Set similar blogs
          });

        setLoading(false); // Set loading to false after fetching
      })
      .catch((err) => {
        console.log(err); // Log any errors
        setLoading(false); // Set loading to false in case of error
      });
  };

  useEffect(() => {
    resetStates(); // Reset states on blog_id change

    fetchBlog(); // Fetch blog data
  }, [blog_id]); // Dependency on blog_id to refetch data

  const resetStates = () => {
    setBlog(blogStructure); // Reset blog state
    setSimilrBlogs(null); // Reset similar blogs
    setLoading(true); // Set loading state
    setLikedByUser(false); // Reset like state
    setCommentsWrapper(false); // Hide comments section
    setTotalParentCommentsLoaded(0); // Reset loaded comments count
  };

  return (
    <AnimationWrapper>
      {loading ? (
        <Loader /> // Show loader if loading
      ) : (
        <BlogContext.Provider
          value={{
            blog,
            setBlog,
            islikedByUser,
            setLikedByUser,
            commentsWrapper,
            setCommentsWrapper,
            totalParentCommentsLoaded,
            setTotalParentCommentsLoaded,
          }}
        >
          <CommentsContainer /> {/* Render comments container */}
          <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
            <img src={banner} className="aspect-video" />{" "}
            {/* Display blog banner */}
            <div className="mt-12">
              <h2>{title}</h2> {/* Display blog title */}
              <div className="flex max-sm:flex-col justify-between my-8">
                <div className="flex gap-5 items-start">
                  <img src={profile_img} className="w-12 h-12 rounded-full" />{" "}
                  {/* Author profile image */}
                  <p className="capitalize">
                    {fullname}
                    <br />@
                    <Link to={`/user/${author_username}`} className="underline">
                      {author_username} {/* Author username as link */}
                    </Link>
                  </p>
                </div>
                <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">
                  Published on {getDay(publishedAt)}{" "}
                  {/* Display published date */}
                </p>
              </div>
            </div>
            <BlogInteraction />{" "}
            {/* Blog interaction buttons (like, share, etc.) */}
            <div className="my-12 font-gelasio blog-page-content">
              {content[0].blocks.map((block, i) => {
                return (
                  <div key={i} className="my-4 md:my-8">
                    <BlogContent block={block} /> {/* Display content block */}
                  </div>
                );
              })}
            </div>
            <BlogInteraction />{" "}
            {/* Blog interaction buttons (like, share, etc.) */}
            {similarBlogs != null && similarBlogs.length ? (
              <>
                <h1 className="text-2xl mt-14 mb-10 font-medium">
                  Similar Blogs
                </h1>

                {similarBlogs.map((blog, i) => {
                  let {
                    author: { personal_info },
                  } = blog;

                  return (
                    <AnimationWrapper
                      key={i}
                      transition={{ duration: 1, delay: i * 0.08 }}
                    >
                      <BlogPostCard content={blog} author={personal_info} />{" "}
                      {/* Render similar blog posts */}
                    </AnimationWrapper>
                  );
                })}
              </>
            ) : (
              " " // No similar blogs available
            )}
          </div>
        </BlogContext.Provider>
      )}
    </AnimationWrapper>
  );
};

export default BlogPage;
