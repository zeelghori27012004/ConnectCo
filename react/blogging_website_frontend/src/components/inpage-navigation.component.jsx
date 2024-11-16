import { useState, useRef, useEffect } from "react";

const InPageNavigation = ({ routes, defaultHidden = [], defaultActiveIndex = 0, children }) => {
    let activeTabLineRef = useRef(); // Ref for the underline indicating the active tab
    let activeTabRef = useRef(); // Ref for the default active tab
    let [inPageNavIndex, setInPageNavIndex] = useState(defaultActiveIndex); // State for tracking active tab index

    // Function to update the position and width of the active tab line
    const changePageState = (btn, i) => {
        let { offsetWidth, offsetLeft } = btn;
        activeTabLineRef.current.style.width = offsetWidth + "px";
        activeTabLineRef.current.style.left = offsetLeft + "px";
        setInPageNavIndex(i);
    };

    // Set the initial position and width of the active tab line
    useEffect(() => {
        changePageState(activeTabRef.current, defaultActiveIndex);
    }, []);

    return (
        <>
            {/* Navigation Bar */}
            <div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto">
                {routes.map((route, i) => (
                    <button
                        ref={i === defaultActiveIndex ? activeTabRef : null} // Assign ref to the default active tab
                        key={i}
                        className={
                            "p-4 px-5 capitalize " +
                            (inPageNavIndex === i ? "text-black" : "text-dark-grey") +
                            (defaultHidden.includes(route) ? " md:hidden" : "")
                        }
                        onClick={(e) => {
                            changePageState(e.target, i);
                        }}
                    >
                        {route}
                    </button>
                ))}
                {/* Active Tab Line */}
                <hr ref={activeTabLineRef} className="absolute bottom-0 duration-300" />
            </div>

            {/* Render the content of the active tab */}
            {Array.isArray(children) ? children[inPageNavIndex] : children}
        </>
    );
};

export default InPageNavigation;
