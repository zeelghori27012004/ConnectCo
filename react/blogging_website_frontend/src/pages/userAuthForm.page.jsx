import { useContext } from "react";
import AnimationWrapper from "../common/page-animation";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import { Link, Navigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/session";
import { UserContext } from "../App";
import { authWithGoogle } from "../common/firebase";

// Component for user authentication form
const UserAuthForm = ({ type }) => {
  let {
    userAuth: { access_token }, // Access token from context
    setUserAuth, // Function to update user authentication in context
  } = useContext(UserContext);

  // Function to handle user authentication through the server
  const userAuthThroughServer = (serverRoute, formData) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData) // Send form data to server
      .then(({ data }) => {
        storeInSession("user", JSON.stringify(data)); // Save user data in session storage

        setUserAuth(data); // Update user authentication in context
      })
      .catch(({ response }) => {
        toast.error(response.data.error); // Display error message
      });
  };

  // Handle form submission for sign-in or sign-up
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    let serverRoute = type == "sign-in" ? "/signin" : "/signup"; // Determine server route based on form type

    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // Regex for email validation
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // Regex for password validation

    // Collect form data
    let form = new FormData(formElement);
    let formData = {};

    for (let [key, value] of form.entries()) {
      formData[key] = value; // Convert FormData into an object
    }

    let { fullname, email, password } = formData;

    // Form validation
    if (fullname) {
      if (fullname.length < 3) {
        return toast.error("Fullname must be at least 3 letters long"); // Validate full name length
      }
    }
    if (!email.length) {
      return toast.error("Enter Email"); // Check if email is entered
    }
    if (!emailRegex.test(email)) {
      return toast.error("Email is invalid"); // Validate email format
    }
    if (!passwordRegex.test(password)) {
      return toast.error(
        "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters"
      ); // Validate password format
    }

    userAuthThroughServer(serverRoute, formData); // Authenticate user through the server
  };

  // Handle Google authentication
  const handleGoogleAuth = (e) => {
    e.preventDefault();

    authWithGoogle()
      .then((user) => {
        let serverRoute = "/google-auth";

        let formData = {
          access_token: user.accessToken, // Get access token from Google auth
        };

        userAuthThroughServer(serverRoute, formData); // Authenticate user through the server with Google access token
      })
      .catch((err) => {
        toast.error("trouble login through google"); // Handle error in Google authentication
        return console.log(err);
      });
  };

  return access_token ? ( // If user is already authenticated, navigate to the home page
    <Navigate to="/" />
  ) : (
    <AnimationWrapper keyValue={type}> {/* Wrapper for page animation */}
      <section className="h-cover flex items-center justify-center">
        <Toaster /> {/* Toast notifications */}
        <form id="formElement" className="w-[80%] max-w-[400px]">
          <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
            {type == "sign-in" ? "Welcome back" : "Join us today"}
          </h1>

          {type != "sign-in" ? ( // Show full name input for sign-up only
            <InputBox
              name="fullname"
              type="text"
              placeholder="Full Name"
              icon="fi-rr-user"
            />
          ) : (
            ""
          )}

          <InputBox
            name="email"
            type="email"
            placeholder="Email"
            icon="fi-rr-envelope"
          />

          <InputBox
            name="password"
            type="password"
            placeholder="Password"
            icon="fi-rr-key"
          />

          <button
            className="btn-dark center mt-14"
            type="submit"
            onClick={handleSubmit} // Handle form submission
          >
            {type.replace("-", " ")}
          </button>

          <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
            <hr className="w-1/2 border-black" />
            <p>or</p>
            <hr className="w-1/2 border-black" />
          </div>

          <button
            className="btn-dark flex items-center justify-center gap-4 w-[90%] center"
            onClick={handleGoogleAuth} // Handle Google authentication
          >
            <img src={googleIcon} className="w-5" />
            continue with google
          </button>

          {type == "sign-in" ? ( // Show link to sign-up for sign-in form
            <p className="mt-6 text-dark-grey text-xl text-center">
              Don't have an account ?
              <Link to="/signup" className="underline text-black text-xl ml-1">
                Join us today
              </Link>
            </p>
          ) : ( // Show link to sign-in for sign-up form
            <p className="mt-6 text-dark-grey text-xl text-center">
              Already a member ?
              <Link to="/signin" className="underline text-black text-xl ml-1">
                Sign in here.
              </Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
};

export default UserAuthForm;
