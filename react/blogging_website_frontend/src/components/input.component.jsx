import { useState } from "react";

// InputBox component renders a styled input field with optional features like icons and password visibility toggle
const InputBox = ({ name, type, id, value, placeholder, icon, disable = false }) => {

    // State to manage the visibility of password input
    const [passwordVisible, setPasswordVisible] = useState(false);

    return (
        <div className="relative w-[100%] mb-4"> {/* Wrapper for input field and associated icons */}
            
            {/* Input field with dynamic attributes based on props and state */}
            <input 
                name={name} // Input name attribute
                type={ type == "password" ? passwordVisible ? "text" : "password" : type } // Toggle between text and password type for password fields
                placeholder={placeholder} // Placeholder text
                defaultValue={value} // Default value of the input
                id={id} // Optional ID for the input
                disabled={disable} // Disable input if 'disable' prop is true
                className="input-box" // Styling class for the input
            />

            {/* Icon displayed to the left of the input field */}
            <i className={"fi " + icon + " input-icon"}></i>

            {
                // Conditional rendering of the eye icon for toggling password visibility
                type == "password" ?
                <i 
                    className={"fi fi-rr-eye" + (!passwordVisible ? "-crossed" : "")  + " input-icon left-[auto] right-4 cursor-pointer"} // Eye icon with dynamic class based on visibility state
                    onClick={() => setPasswordVisible(currentVal => !currentVal)} // Toggle password visibility on click
                ></i>
                : ""
            }

        </div>
    );
};

export default InputBox;
