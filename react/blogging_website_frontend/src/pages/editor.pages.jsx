import { useContext, useEffect, useState } from "react"; // React hooks for state and lifecycle management
import { UserContext } from "../App"; // User context for authentication and user data
import { Navigate, useParams } from "react-router-dom"; // Routing utilities
import BlogEditor from "../components/blog-editor.component"; // Blog editor component
import PublishForm from "../components/publish-form.component"; // Publish form component
import { createContext } from "react"; // React context creation
import Loader from "../components/loader.component"; // Loader component for showing a loading spinner
import axios from "axios"; // Axios for making HTTP requests

// Default structure for a blog
const blogStructure = {
  title: "", // Title of the blog
  banner: "", // URL of the blog banner image
  conent: [], // Content blocks of the blog (used with the editor)
  tags: [], // Tags associated with the blog
  des: "", // Description of the blog
  author: { personal_info: {} }, // Author details
};

// Context for managing state across the editor-related components
export const EditorContext = createContext({});

const Editor = () => {
  let { blog_id } = useParams(); // Get the blog ID from the URL parameters

  // State to manage the blog object
  const [blog, setBlog] = useState(blogStructure);
  // State to manage the current state of the editor (e.g., "editor" or "publish")
  const [editorState, setEditorState] = useState("editor");
  // State to manage the text editor instance and its readiness
  const [textEditor, setTextEditor] = useState({ isReady: false });
  // State to manage the loading state of the component
  const [loading, setLoading] = useState(true);

  // Destructure the access token from UserContext for authentication
  let {
    userAuth: { access_token },
  } = useContext(UserContext);

  // Effect to fetch the blog data if a blog ID is present
  useEffect(() => {
    if (!blog_id) {
      return setLoading(false); // If no blog ID, set loading to false and return
    }

    // Fetch blog data for editing
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", {
        blog_id, // ID of the blog to fetch
        draft: true, // Indicate fetching a draft
        mode: "edit", // Indicate edit mode
      })
      .then(({ data: { blog } }) => {
        setBlog(blog); // Update the blog state with fetched data
        setLoading(false); // Stop the loading state
      })
      .catch((err) => {
        setBlog(null); // Set blog to null in case of an error
        setLoading(false); // Stop the loading state
      });
  }, []);

  return (
    // Provide the editor-related state and functions to child components via context
    <EditorContext.Provider
      value={{
        blog, // Current blog data
        setBlog, // Function to update blog data
        editorState, // Current state of the editor (e.g., "editor" or "publish")
        setEditorState, // Function to update the editor state
        textEditor, // Text editor instance and readiness state
        setTextEditor, // Function to update the text editor state
      }}
    >
      {/* Conditional rendering based on authentication and loading state */}
      {access_token === null ? ( // Redirect to signin if not authenticated
        <Navigate to="/signin" />
      ) : loading ? ( // Show loader if data is still loading
        <Loader />
      ) : editorState == "editor" ? ( // Show the editor if in "editor" state
        <BlogEditor />
      ) : (
        <PublishForm /> // Show the publish form in the "publish" state
      )}
    </EditorContext.Provider>
  );
};

export default Editor;
