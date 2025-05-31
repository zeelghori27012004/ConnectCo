// Import necessary libraries and components for routing, image handling, animations, 
// and editor functionalities.
import { Link, useNavigate, useParams } from "react-router-dom";
import lightLogo from "../imgs/logo-light.jpeg";
import darkLogo from "../imgs/logo-dark.jpeg";
import AnimationWrapper from "../common/page-animation";
import lightBanner from "../imgs/blog banner light.png";
import darkBanner from "../imgs/blog banner dark.png";
import { uploadImage } from "../common/aws";
import { useContext, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { EditorContext } from "../pages/editor.pages";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./tools.component";
import axios from "axios";
import { ThemeContext, UserContext } from "../App";

// Define the BlogEditor component
const BlogEditor = () => {
  // Extract blog-related state and functions from EditorContext
  let {
    blog,
    blog: { title, banner, content, tags, des },
    setBlog,
    textEditor,
    setTextEditor,
    setEditorState,
  } = useContext(EditorContext);

  // Extract user authentication details from UserContext
  let {
    userAuth: { access_token },
  } = useContext(UserContext);

  // Extract theme information from ThemeContext
  let { theme } = useContext(ThemeContext);

  // Extract blog_id from URL parameters
  let { blog_id } = useParams();

  // Initialize navigation function from React Router
  let navigate = useNavigate();

  // Initialize the text editor when the component is first rendered
  useEffect(() => {
    if (!textEditor.isReady) {
      setTextEditor(
        new EditorJS({
          holderId: "textEditor", // ID of the HTML element to render the editor
          data: Array.isArray(content) ? content[0] : content, // Prepopulate with blog content
          tools: tools, // Define the tools available in the editor
          placeholder: "Let's write an awesome story", // Placeholder text for the editor
        })
      );
    }
  }, []);

  // Handle image upload for the blog banner
  const handleBannerUpload = (e) => {
    let img = e.target.files[0]; // Get the uploaded image file

    if (img) {
      let loadingToast = toast.loading("Uploading..."); // Show loading toast

      uploadImage(img)
        .then((url) => {
          if (url) {
            toast.dismiss(loadingToast); // Dismiss loading toast
            toast.success("Uploaded 👍"); // Show success toast

            setBlog({ ...blog, banner: url }); // Update blog state with new banner URL
          }
        })
        .catch((err) => {
          toast.dismiss(loadingToast); // Dismiss loading toast
          return toast.error(err); // Show error toast
        });
    }
  };

  // Prevent the Enter key from creating new lines in the blog title input
  const handleTitleKeyDown = (e) => {
    if (e.keyCode == 13) {
      // Enter key
      e.preventDefault(); // Prevent default behavior
    }
  };

  // Dynamically resize the blog title input and update its state
  const handleTitleChange = (e) => {
    let input = e.target;

    input.style.height = "auto"; // Reset height
    input.style.height = input.scrollHeight + "px"; // Adjust height to fit content

    setBlog({ ...blog, title: input.value }); // Update blog state with new title
  };

  // Fallback for the banner image in case of an error
  const handleError = (e) => {
    let img = e.target;

    img.src = theme == "light" ? lightBanner : darkBanner; // Use default banner based on theme
  };

  // Handle the blog publishing process
  const handlePublishEvent = () => {
    if (!banner.length) {
      return toast.error("Upload a blog banner to publish it"); // Require banner
    }

    if (!title.length) {
      return toast.error("Write blog title to publish it"); // Require title
    }

    if (textEditor.isReady) {
      textEditor
        .save()
        .then((data) => {
          if (data.blocks.length) {
            setBlog({ ...blog, content: data }); // Save editor content
            setEditorState("publish"); // Set state to publish
          } else {
            return toast.error("Write something in your blog to publish it"); // Require content
          }
        })
        .catch((err) => {
          console.log(err); // Log errors
        });
    }
  };

  // Save the blog as a draft
  const handleSaveDraft = (e) => {
    if (e.target.className.includes("disable")) {
      return; // Prevent multiple clicks
    }

    if (!title.length) {
      return toast.error("Write blog title before saving it as a draft"); // Require title
    }

    let loadingToast = toast.loading("Saving Draft...."); // Show loading toast

    e.target.classList.add("disable"); // Disable button to prevent multiple clicks

    if (textEditor.isReady) {
      textEditor.save().then((content) => {
        let blogObj = {
          title,
          banner,
          des,
          content,
          tags,
          draft: true, // Mark as draft
        };

        axios
          .post(
            import.meta.env.VITE_SERVER_DOMAIN + "/create-blog",
            { ...blogObj, id: blog_id },
            {
              headers: {
                Authorization: `Bearer ${access_token}`, // Include authentication token
              },
            }
          )
          .then(() => {
            e.target.classList.remove("disable"); // Re-enable button

            toast.dismiss(loadingToast); // Dismiss loading toast
            toast.success("Saved 👍"); // Show success toast

            setTimeout(() => {
              navigate("/dashboard/blogs?tab=draft"); // Redirect to drafts
            }, 500);
          })
          .catch(({ response }) => {
            e.target.classList.remove("disable"); // Re-enable button
            toast.dismiss(loadingToast); // Dismiss loading toast

            return toast.error(response.data.error); // Show error toast
          });
      });
    }
  };

  return (
    <>
      {/* Navigation bar with logo, title, and action buttons */}
      <nav className="navbar">
        <Link to="/" className="flex-none w-20">
          <img src={theme == "light" ? darkLogo : lightLogo} /> {/* Switch logo based on theme */}
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">
          {title.length ? title : "New Blog"} {/* Display blog title or default text */}
        </p>

        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2" onClick={handlePublishEvent}>
            Publish
          </button>
          <button className="btn-light py-2" onClick={handleSaveDraft}>
            Save Draft
          </button>
        </div>
      </nav>
      <Toaster /> {/* Toast notifications */}
      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px] w-full">
            {/* Blog banner upload section */}
            <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
              <label htmlFor="uploadBanner">
                <img src={banner} className="z-20" onError={handleError} /> {/* Banner image */}
                <input
                  id="uploadBanner"
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  hidden
                  onChange={handleBannerUpload} // Handle image upload
                />
              </label>
            </div>

            {/* Blog title input */}
            <textarea
              defaultValue={title}
              placeholder="Blog Title"
              className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40 bg-white"
              onKeyDown={handleTitleKeyDown} // Prevent Enter key behavior
              onChange={handleTitleChange} // Update title dynamically
            ></textarea>

            <hr className="w-full opacity-10 my-5" />

            {/* Text editor section */}
            <div id="textEditor" className="font-gelasio"></div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
