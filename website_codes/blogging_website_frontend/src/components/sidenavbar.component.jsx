import { useContext, useEffect, useRef, useState } from "react";
import { Outlet, Navigate, NavLink } from "react-router-dom";
import { UserContext } from "../App";

// SideNav component handles the sidebar navigation for the dashboard and related pages
const SideNav = () => {

    // Extracting user authentication and notification status from UserContext
    let { userAuth: { access_token, new_notification_available } } = useContext(UserContext);

    // Extracting the current page from the URL
    let page = location.pathname.split("/")[2];

    // State to track the current page name for display purposes
    let [pageState, setPageState] = useState(page.replace('-', ' '));

    // State to toggle the visibility of the side navigation on smaller screens
    let [showSideNav, setShowSideNav] = useState(false);

    // References for dynamically updating the active tab line and handling button clicks
    let activeTabLine = useRef();
    let sideBarIconTab = useRef();
    let pageStateTab = useRef();

    // Handles page state changes and adjusts the active tab line position and size
    const changePageState = (e) => {
        let { offsetWidth, offsetLeft } = e.target;

        // Adjust the width and position of the active tab line
        activeTabLine.current.style.width = offsetWidth + "px";
        activeTabLine.current.style.left = offsetLeft + "px";

        // Toggle side navigation visibility based on the clicked element
        if (e.target == sideBarIconTab.current) {
            setShowSideNav(true);
        } else {
            setShowSideNav(false);
        }
    };

    // useEffect to handle side navigation visibility and simulate a click on the current page tab when the pageState changes
    useEffect(() => {
        setShowSideNav(false); // Close the side navigation on state change
        pageStateTab.current.click(); // Simulate a click on the pageState tab
    }, [pageState]);

    return (
        // Redirect to sign-in page if no access token is present
        access_token === null ? (
            <Navigate to="/signin" />
        ) : (
            <>
                <section className="relative flex gap-10 py-0 m-0 max-md:flex-col">
                    {/* Sticky Sidebar Navigation */}
                    <div className="sticky top-[80px] z-30"> 

                        {/* Top navigation for smaller screens */}
                        <div className="md:hidden bg-white py-1 border-b border-grey flex flex-nowrap overflow-x-auto">
                            {/* Sidebar toggle button */}
                            <button ref={sideBarIconTab} className="p-5 capitalize" onClick={changePageState}>
                                <i className="fi fi-rr-bars-staggered pointer-events-none"></i>
                            </button>
                            {/* Page name display and active tab line */}
                            <button ref={pageStateTab} className="p-5 capitalize" onClick={changePageState}>
                                {pageState}
                            </button>
                            <hr ref={activeTabLine} className="absolute bottom-0 duration-500" />
                        </div>

                        {/* Sidebar content */}
                        <div className={
                            "min-w-[200px] h-[calc(100vh-80px-60px)] md:h-cover md:sticky top-24 overflow-y-auto p-6 md:pr-0 md:border-grey md:border-r absolute max-md:top-[64px] bg-white max-md:w-[calc(100%+80px)] max-md:px-16 max-md:-ml-7 duration-500 " +
                            (!showSideNav ? "max-md:opacity-0 max-md:pointer-events-none" : "opacity-100 pointer-events-auto")
                        }>
                            {/* Dashboard header */}
                            <h1 className="text-xl text-dark-grey mb-3">Dashboard</h1>
                            <hr className="border-grey -ml-6 mb-8 mr-6" />

                            {/* Navigation links */}
                            <NavLink to="/dashboard/blogs" onClick={(e) => setPageState(e.target.innerText)} className="sidebar-link">
                                <i className="fi fi-rr-document"></i>
                                Blogs
                            </NavLink>

                            <NavLink to="/dashboard/notifications" onClick={(e) => setPageState(e.target.innerText)} className="sidebar-link">
                                <div className="relative">
                                    <i className="fi fi-rr-bell"></i>
                                    {new_notification_available ? (
                                        <span className="bg-red w-2 h-2 rounded-full absolute z-10 top-0 right-0"></span>
                                    ) : ""}
                                </div>
                                Notifications
                            </NavLink>

                            <NavLink to="/editor" onClick={(e) => setPageState(e.target.innerText)} className="sidebar-link">
                                <i className="fi fi-rr-file-edit"></i>
                                Write
                            </NavLink>

                            {/* Settings section */}
                            <h1 className="text-xl text-dark-grey mt-20 mb-3">Settings</h1>
                            <hr className="border-grey -ml-6 mb-8 mr-6" />

                            <NavLink to="/settings/edit-profile" onClick={(e) => setPageState(e.target.innerText)} className="sidebar-link">
                                <i className="fi fi-rr-user"></i>
                                Edit Profile
                            </NavLink>

                            <NavLink to="/settings/change-password" onClick={(e) => setPageState(e.target.innerText)} className="sidebar-link">
                                <i className="fi fi-rr-lock"></i>
                                Change Password
                            </NavLink>
                        </div>
                    </div>

                    {/* Main content area */}
                    <div className="max-md:-mt-8 mt-5 w-full">
                        <Outlet />
                    </div>
                </section>
            </>
        )
    );
};

export default SideNav;
