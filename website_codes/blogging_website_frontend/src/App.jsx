import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/navbar.component";
import UserAuthForm from "./pages/userAuthForm.page";
import { createContext, useEffect, useState } from "react";
import { lookInSession } from "./common/session";
import Editor from "./pages/editor.pages";
import HomePage from "./pages/home.page";
import SearchPage from "./pages/search.page";
import PageNotFound from "./pages/404.page";
import ProfilePage from "./pages/profile.page";
import BlogPage from "./pages/blog.page";
import SideNav from "./components/sidenavbar.component";
import ChangePassword from "./pages/change-password.page";
import EditProfile from "./pages/edit-profile.page";
import Notifications from "./pages/notifications.page";
import ManageBlogs from "./pages/manage-blogs.page";

// Create contexts for user authentication and theme
export const UserContext = createContext({});
export const ThemeContext = createContext({});

// Utility function to check system's dark mode preference
const darkThemePreference = () => window.matchMedia("(prefers-color-scheme: dark)").matches;

const App = () => {

    // State to manage user authentication details
    const [userAuth, setUserAuth] = useState({});

    // State to manage theme, initialized based on system preference
    const [theme, setTheme] = useState(() => darkThemePreference() ? "dark" : "light");

    useEffect(() => {
        // Retrieve user and theme data from session storage
        let userInSession = lookInSession("user");
        let themeInSession = lookInSession("theme");

        // Set user authentication state from session or initialize as logged out
        userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({ access_token: null });
        
        // Apply the theme from session or fallback to default
        if (themeInSession) {
            setTheme(() => {
                document.body.setAttribute('data-theme', themeInSession);
                return themeInSession;
            });
        } else {
            document.body.setAttribute('data-theme', theme);
        }
    }, []); // Run on component mount

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <UserContext.Provider value={{ userAuth, setUserAuth }}>
                {/* Define application routes */}
                <Routes>
                    {/* Routes for the editor page, including optional blog_id */}
                    <Route path="/editor" element={<Editor />} />
                    <Route path="/editor/:blog_id" element={<Editor />} />
                    
                    {/* Main app structure with a Navbar */}
                    <Route path="/" element={<Navbar />}>
                        <Route index element={<HomePage />} /> {/* Home page route */}
                        
                        {/* Dashboard routes nested under SideNav */}
                        <Route path="dashboard" element={<SideNav />}>
                            <Route path="blogs" element={<ManageBlogs />} />
                            <Route path="notifications" element={<Notifications />} />
                        </Route>

                        {/* Settings routes nested under SideNav */}
                        <Route path="settings" element={<SideNav />}>
                            <Route path="edit-profile" element={<EditProfile />} />
                            <Route path="change-password" element={<ChangePassword />} />
                        </Route>

                        {/* Authentication routes */}
                        <Route path="signin" element={<UserAuthForm type="sign-in" />} />
                        <Route path="signup" element={<UserAuthForm type="sign-up" />} />

                        {/* Routes for search, user profiles, and blogs */}
                        <Route path="search/:query" element={<SearchPage />} />
                        <Route path="user/:id" element={<ProfilePage />} />
                        <Route path="blog/:blog_id" element={<BlogPage />} />

                        {/* Fallback route for unmatched paths */}
                        <Route path="*" element={<PageNotFound />} />
                    </Route>
                </Routes>
            </UserContext.Provider>
        </ThemeContext.Provider>
    );
};

export default App;
