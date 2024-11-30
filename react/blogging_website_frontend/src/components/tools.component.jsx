// Importing editor.js tools for creating a rich text editor with various features
import Embed from "@editorjs/embed"; // Tool for embedding external content (e.g., videos, tweets)
import List from "@editorjs/list"; // Tool for creating ordered and unordered lists
import Image from "@editorjs/image"; // Tool for adding images
import Header from "@editorjs/header"; // Tool for adding headers with different levels
import Quote from "@editorjs/quote"; // Tool for adding quotes
import Marker from "@editorjs/marker"; // Tool for highlighting text
import InlineCode from "@editorjs/inline-code"; // Tool for adding inline code snippets

import { uploadImage } from "../common/aws"; // Function for uploading images to AWS

// Function to handle image upload by file
const uploadImageByFile = (e) => {
    // Upload image using the AWS function and return a success response with the file URL
    return uploadImage(e).then(url => {
        if (url) {
            return {
                success: 1, // Indicates successful upload
                file: { url } // Contains the URL of the uploaded file
            };
        }
    });
};

// Function to handle image upload by URL
const uploadImageByURL = (e) => {
    // Simulate the process of resolving a URL
    let link = new Promise((resolve, reject) => {
        try {
            resolve(e); // Resolve with the URL
        } catch (err) {
            reject(err); // Handle errors during URL resolution
        }
    });

    // Return a success response with the resolved URL
    return link.then(url => {
        return {
            success: 1, // Indicates successful upload
            file: { url } // Contains the URL of the image
        };
    });
};

// Configuration object for editor.js tools
export const tools = {
    embed: Embed, // Embedding external content
    list: {
        class: List, // List tool
        inlineToolbar: true // Enable inline toolbar for editing list items
    },
    image: {
        class: Image, // Image tool
        config: {
            uploader: {
                // Specify functions to handle image uploads
                uploadByUrl: uploadImageByURL, // Upload image via URL
                uploadByFile: uploadImageByFile // Upload image via file
            }
        }
    },
    header: {
        class: Header, // Header tool
        config: {
            placeholder: "Type Heading....", // Placeholder text for the header
            levels: [2, 3], // Allow heading levels H2 and H3
            defaultLevel: 2 // Default heading level is H2
        }
    },
    quote: {
        class: Quote, // Quote tool
        inlineToolbar: true // Enable inline toolbar for editing quotes
    },
    marker: Marker, // Marker tool for highlighting text
    inlineCode: InlineCode // Inline code tool for adding code snippets
};
