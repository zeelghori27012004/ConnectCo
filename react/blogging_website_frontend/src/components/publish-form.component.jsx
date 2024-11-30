import { Toaster, toast } from "react-hot-toast"; // For showing toast notifications
import AnimationWrapper from "../common/page-animation"; // Animation wrapper for smooth transitions
import { useContext } from "react"; // React context API
import { EditorContext } from "../pages/editor.pages"; // Context for editor state management
import Tag from "./tags.component"; // Component for displaying tags
import axios from "axios"; // HTTP client for API calls
import { UserContext } from "../App"; // User context for authentication and user data
import { useNavigate, useParams } from "react-router-dom"; // For navigation and accessing route parameters

const PublishForm = () => {
    // Character limit for blog description
    let characterLimit = 200;
    // Maximum number of tags allowed
    let tagLimit = 10;

    // Get the blog ID from the route parameters
    let { blog_id } = useParams();

    // Destructure required states and functions from EditorContext
    let { blog, blog: { banner, title, tags, des, content }, setEditorState, setBlog } = useContext(EditorContext);

    // Destructure access token from UserContext for API authentication
    let { userAuth: { access_token } } = useContext(UserContext);

    // For navigating between routes
    let navigate = useNavigate();

    // Function to handle closing the publish form and returning to the editor
    const handleCloseEvent = () => {
        setEditorState("editor");
    };

    // Function to handle changes to the blog title
    const handleBlogTitleChange = (e) => {
        let input = e.target;
        setBlog({ ...blog, title: input.value });
    };

    // Function to handle changes to the blog description
    const handleBlogDesChange = (e) => {
        let input = e.target;
        setBlog({ ...blog, des: input.value });
    };

    // Prevents new lines in the blog title input field (triggered by the Enter key)
    const handleTitleKeyDown = (e) => {
        if (e.keyCode == 13) { // Enter key
            e.preventDefault();
        }
    };

    // Handles adding tags when Enter or comma key is pressed
    const handleKeyDown = (e) => {
        if (e.keyCode == 13 || e.keyCode == 188) { // Enter or comma
            e.preventDefault();

            let tag = e.target.value;

            // Add the tag if within limit and not already present
            if (tags.length < tagLimit) {
                if (!tags.includes(tag) && tag.length) {
                    setBlog({ ...blog, tags: [...tags, tag] });
                }
            } else {
                toast.error(`You can add max ${tagLimit} Tags`);
            }

            e.target.value = ""; // Clear the input
        }
    };

    // Handles publishing the blog
    const publishBlog = (e) => {
        if (e.target.className.includes("disable")) {
            return;
        }

        // Validation for required fields
        if (!title.length) {
            return toast.error("Write blog title before publishing");
        }

        if (!des.length || des.length > characterLimit) {
            return toast.error(`Write a description about your blog within ${characterLimit} characters to publish`);
        }

        if (!tags.length) {
            return toast.error("Enter at least 1 tag to help us rank your blog");
        }

        // Show loading toast and disable the button
        let loadingToast = toast.loading("Publishing....");
        e.target.classList.add('disable');

        // Prepare blog data
        let blogObj = {
            title, banner, des, content, tags, draft: false
        };

        // API call to create/publish the blog
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", { ...blogObj, id: blog_id }, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
        .then(() => {
            e.target.classList.remove('disable');
            toast.dismiss(loadingToast);
            toast.success("Published 👍");

            // Redirect to dashboard after successful publishing
            setTimeout(() => {
                navigate("/dashboard/blogs");
            }, 500);
        })
        .catch(({ response }) => {
            e.target.classList.remove('disable');
            toast.dismiss(loadingToast);
            toast.error(response.data.error);
        });
    };

    return (
        <AnimationWrapper>
            <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
                <Toaster /> {/* Toast notifications */}
                {/* Close button for the form */}
                <button className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]"
                onClick={handleCloseEvent}>
                    <i className="fi fi-br-cross"></i>
                </button>

                {/* Blog preview section */}
                <div className="max-w-[550px] center">
                    <p className="text-dark-grey mb-1">Preview</p>
                    <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
                        <img src={banner} />
                    </div>
                    <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">{title}</h1>
                    <p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">{des}</p>
                </div>

                {/* Blog details input section */}
                <div className="border-grey lg:border-1 lg:pl-8">
                    <p className="text-dark-grey mb-2 mt-9">Blog Title</p>
                    <input type="text" placeholder="Blog Title" defaultValue={title} className="input-box pl-4" onChange={handleBlogTitleChange} />

                    <p className="text-dark-grey mb-2 mt-9">Short description about your blog</p>
                    <textarea 
                        maxLength={characterLimit}
                        defaultValue={des}
                        className="h-40 resize-none leading-7 input-box pl-4"
                        onChange={handleBlogDesChange}
                        onKeyDown={handleTitleKeyDown}>
                    </textarea>
                    <p className="mt-1 text-dark-grey text-sm text-right">{characterLimit - des.length} characters left</p>

                    <p className="text-dark-grey mb-2 mt-9">Topics - ( Helps is searching and ranking your blog post )</p>
                    <div className="relative input-box pl-2 py-2 pb-4">
                        <input type="text" placeholder="Topic" className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white"
                        onKeyDown={handleKeyDown} />
                        {   
                            tags.map((tag, i) => {
                                return <Tag tag={tag} tagIndex={i} key={i} />;
                            }) 
                        }
                    </div>
                    <p className="mt-1 mb-4 text-dark-grey text-right">{tagLimit - tags.length} Tags left</p>

                    {/* Publish button */}
                    <button className="btn-dark px-8" onClick={publishBlog}>
                        Publish
                    </button>
                </div>
            </section>
        </AnimationWrapper>
    );
};

export default PublishForm;
