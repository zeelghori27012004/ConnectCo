import { useContext, useEffect, useState } from "react"; // Importing necessary hooks from React
import { Link, Outlet, useNavigate } from "react-router-dom"; // Importing components and hooks from react-router-dom for navigation and routing
import darkLogo from "../imgs/logo-dark.jpeg"; // Importing the dark theme logo image
import lightLogo from "../imgs/logo-light.jpeg"; // Importing the light theme logo image
import { ThemeContext, UserContext } from "../App"; // Importing context for theme and user authentication
import UserNavigationPanel from "./user-navigation.component"; // Importing user navigation panel component
import axios from "axios"; // Importing axios for HTTP requests
import { storeInSession } from "../common/session"; // Importing a utility function for session storage

// Navbar component definition
const Navbar = () => {
  const [searchBoxVisibility, setSearchBoxVisibility] = useState(false); // State to manage visibility of the search box
  const [userNavPanel, setUserNavPanel] = useState(false); // State to manage visibility of the user navigation panel

  let { theme, setTheme } = useContext(ThemeContext); // Extracting theme and its setter from ThemeContext

  let navigate = useNavigate(); // Hook to programmatically navigate routes

  const {
    userAuth, // Extracting user authentication details
    userAuth: { access_token, profile_img, new_notification_available }, // Destructuring userAuth for specific properties
    setUserAuth, // Setter for user authentication context
  } = useContext(UserContext); // Extracting user authentication context

  // Effect to fetch new notifications when access_token changes
  useEffect(() => {
    if (access_token) {
      axios
        .get(import.meta.env.VITE_SERVER_DOMAIN + "/new-notification", {
          headers: {
            Authorization: `Bearer ${access_token}`, // Setting Authorization header with Bearer token
          },
        })
        .then(({ data }) => {
          setUserAuth({ ...userAuth, ...data }); // Updating user authentication state with new notification data
        })
        .catch((err) => {
          console.log(err); // Logging any error that occurs during the request
        });
    }
  }, [access_token]);

  // Toggles the visibility of the user navigation panel
  const handleUserNavPanel = () => {
    setUserNavPanel((currentVal) => !currentVal);
  };

  // Handles the search input and navigates to search results page on Enter key press
  const handleSearch = (e) => {
    let query = e.target.value;

    if (e.keyCode == 13 && query.length) {
      navigate(`/search/${query}`); // Navigate to the search results page
    }
  };

  // Closes the user navigation panel after a brief delay
  const handleBlur = () => {
    setTimeout(() => {
      setUserNavPanel(false);
    }, 200);
  };

  // Toggles between light and dark themes and stores the preference in session
  const changeTheme = () => {
    let newTheme = theme == "light" ? "dark" : "light";

    setTheme(newTheme); // Updating theme context

    document.body.setAttribute("data-theme", newTheme); // Applying the theme to the document body

    storeInSession("theme", newTheme); // Storing the theme in session storage
  };

  return (
    <>
      {/* Navigation bar container */}
      <nav className="navbar z-50">
        {/* Logo with navigation link */}
        <Link to="/" className="flex-none w-20">
          <img
            src={theme == "light" ? darkLogo : lightLogo} // Switch logo based on theme
            className="w-20"
          />
        </Link>

        {/* Search box */}
        <div
          className={
            "absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show " +
            (searchBoxVisibility ? "show" : "hide")
          }
        >
          <input
            type="text"
            placeholder="Search"
            className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12"
            onKeyDown={handleSearch} // Trigger search on key press
          />

          <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
        </div>

        {/* Navigation items and actions */}
        <div className="flex items-center gap-3 md:gap-6 ml-auto">
          {/* Search toggle for mobile */}
          <button
            className="md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center"
            onClick={() => setSearchBoxVisibility((currentVal) => !currentVal)} // Toggle search box visibility
          >
            <i className="fi fi-rr-search text-xl"></i>
          </button>

          {/* Link to the editor page */}
          <Link to="/editor" className="hidden md:flex gap-2 link">
            <i className="fi fi-rr-file-edit"></i>
            <p>Write</p>
          </Link>

          {/* Theme toggle button */}
          <button
            className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/10"
            onClick={changeTheme} // Change theme on click
          >
            <i
              className={
                "fi fi-rr-" +
                (theme == "light" ? "moon-stars" : "sun") + // Dynamic icon based on theme
                " text-2xl block mt-1"
              }
            ></i>
          </button>

          {/* User authenticated actions */}
          {access_token ? (
            <>
              {/* Notifications button */}
              <Link to="/dashboard/notifications">
                <button className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/10">
                  <i className="fi fi-rr-bell text-2xl block mt-1"></i>
                  {new_notification_available ? (
                    <span className="bg-red w-3 h-3 rounded-full absolute z-10 top-2 right-2"></span> // Notification indicator
                  ) : (
                    ""
                  )}
                </button>
              </Link>

              {/* User profile button */}
              <div
                className="relative"
                onClick={handleUserNavPanel} // Toggle user navigation panel
                onBlur={handleBlur} // Handle blur event
              >
                <button className="w-12 h-12 mt-1">
                  <img
                    src={profile_img} // User profile image
                    className="w-full h-full object-cover rounded-full"
                  />
                </button>

                {userNavPanel ? <UserNavigationPanel /> : ""} {/* Conditionally render user navigation panel */}
              </div>
            </>
          ) : (
            // Actions for unauthenticated users
            <>
              <Link className="btn-dark py-2" to="/signin">
                Sign In
              </Link>
              <Link className="btn-light py-2 hidden md:block" to="/signup">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Outlet for nested routes */}
      <Outlet />
    </>
  );
};

export default Navbar; // Exporting Navbar component
