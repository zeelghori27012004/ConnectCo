import axios from "axios";
import AnimationWrapper from "../common/page-animation";
import InputBox from "../components/input.component";
import { useContext, useRef } from "react";
import { toast, Toaster } from "react-hot-toast";
import { UserContext } from "../App";

// ChangePassword component handles the logic and UI for updating the user's password
const ChangePassword = () => {

    // Extracting the access token from the UserContext for authenticated API requests
    let { userAuth: { access_token } } = useContext(UserContext);

    // Reference to the change password form for direct manipulation and data retrieval
    let changePasswordForm = useRef();

    // Regular expression for password validation (6-20 characters, with at least one uppercase letter, one lowercase letter, and one numeric digit)
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        // Create a FormData object from the form and extract its values into an object
        let form = new FormData(changePasswordForm.current);
        let formData = {};

        for (let [key, value] of form.entries()) {
            formData[key] = value; // Populate formData with key-value pairs from the form
        }

        let { currentPassword, newPassword } = formData;

        // Check if any of the password fields are empty
        if (!currentPassword.length || !newPassword.length) {
            return toast.error("Fill all the inputs"); // Show error toast for empty fields
        }

        // Validate the passwords against the defined regex pattern
        if (!passwordRegex.test(currentPassword) || !passwordRegex.test(newPassword)) {
            return toast.error("Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters");
        }

        // Disable the submit button to prevent multiple submissions
        e.target.setAttribute("disabled", true);

        // Show a loading toast while the password update request is being processed
        let loadingToast = toast.loading("Updating....");

        // Send the API request to update the password
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/change-password", formData, {
            headers: {
                'Authorization': `Bearer ${access_token}` // Pass the access token in the Authorization header
            }
        })
        .then(() => {
            // Dismiss the loading toast, re-enable the button, and show success toast on successful update
            toast.dismiss(loadingToast);
            e.target.removeAttribute("disabled");
            return toast.success("Password Updated");
        })
        .catch(({ response }) => {
            // Handle errors by dismissing the loading toast, re-enabling the button, and showing an error toast
            toast.dismiss(loadingToast);
            e.target.removeAttribute("disabled");
            return toast.error(response.data.error);
        });
    };

    return (
        <AnimationWrapper> {/* Wrapper component for page animation */}
            <Toaster /> {/* Toaster component to display toast notifications */}
            <form ref={changePasswordForm}> {/* Form to handle password change inputs */}
                <h1 className="max-md:hidden">Change Password</h1> {/* Page title visible only on larger screens */}

                {/* Input fields for current and new passwords */}
                <div className="py-10 w-full md:max-w-[400px]">
                    <InputBox name="currentPassword" type="password" className="profile-edit-input" placeholder="Current Password" icon="fi-rr-unlock" />
                    <InputBox name="newPassword" type="password" className="profile-edit-input" placeholder="New Password" icon="fi-rr-unlock" />

                    {/* Submit button to trigger the handleSubmit function */}
                    <button onClick={handleSubmit} className="btn-dark px-10" type="submit">Change Password</button>
                </div>
            </form>
        </AnimationWrapper>
    );
};

export default ChangePassword;
