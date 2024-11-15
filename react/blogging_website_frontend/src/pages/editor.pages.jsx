import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import { Navigate, useParams } from "react-router-dom";
import BlogEditor from "../components/blog-editor.component";
import PublishForm from "../components/publish-form.component";
import { createContext } from 'react';
import Loader from "../components/loader.component";
import axios from "axios";

 
const Editor = () => {

    const [ editorState, setEditorState ] = useState("editor");
    let { userAuth: { access_token } } = useContext(UserContext) 

    return (
        <EditorContext.Provider value={{ blog, setBlog, editorState, setEditorState, textEditor, setTextEditor }}>
            { 
                access_token === null ? <Navigate to="/signin" /> 
                : 
                editorState == "editor" ? <BlogEditor /> : <PublishForm /> 
            }
        </EditorContext.Provider>
    )
}

export default Editor;