import { useContext } from "react";
import { EditorContext } from "../pages/editor.pages";

// Tag component handles the display, editing, and deletion of a single tag
const Tag = ({ tag, tagIndex }) => {

    // Accessing blog state and setBlog function from EditorContext
    let { blog, blog: { tags }, setBlog } = useContext(EditorContext);

    // Enables the tag to become editable when clicked
    const addEditable = (e) => {
        e.target.setAttribute("contentEditable", true); // Make the tag content editable
        e.target.focus(); // Focus the editable tag
    }

    // Handles editing a tag when 'Enter' or ',' is pressed
    const handleTagEdit = (e) => {
        if (e.keyCode == 13 || e.keyCode == 188) { // Enter or comma key
            e.preventDefault();

            let currentTag = e.target.innerText; // Get the edited tag value

            tags[tagIndex] = currentTag; // Update the tag in the tags array

            setBlog({ ...blog, tags }); // Update the blog state with the modified tags

            e.target.setAttribute("contentEditable", false); // Disable content editing
        }
    }

    // Handles deletion of the tag
    const handleTagDelete = () => {
        // Filter out the current tag from the tags array
        tags = tags.filter(t => t != tag);

        setBlog({ ...blog, tags }); // Update the blog state with the filtered tags
    }

    return (
        // Render the tag with styling and actions for editing and deletion
        <div className="relative p-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-10">
            {/* Display the tag text and allow editing */}
            <p className="outline-none" onKeyDown={handleTagEdit} onClick={addEditable}>{tag}</p>

            {/* Delete button for the tag */}
            <button
                className="mt-[2px] rounded-full absolute right-3 top-1/2 -translate-y-1/2"
                onClick={handleTagDelete}
            >
                <i className="fi fi-br-cross text-sm pointer-events-none"></i>
            </button>
        </div>
    )
}

export default Tag;
