import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import { filterPaginationData } from "../common/filter-pagination-data";
import { Toaster } from "react-hot-toast";
import InPageNavigation from "../components/inpage-navigation.component";
import Loader from "../components/loader.component";
import NoDataMessage from "../components/nodata.component";
import AnimationWrapper from "../common/page-animation";
import { ManageDraftBlogPost, ManagePublishedBlogCard } from "../components/manage-blogcard.component";
import LoadMoreDataBtn from "../components/load-more.component";
import { useSearchParams } from "react-router-dom";

const ManageBlogs = () => {
    
    // State to manage published blogs
    const [blogs, setBlogs] = useState(null);

    // State to manage draft blogs
    const [drafts, setDrafts] = useState(null);

    // State to manage search query
    const [query, setQuery] = useState("");

    // Retrieve the active tab from URL parameters
    let activeTab = useSearchParams()[0].get("tab");

    // Access user's authentication context
    let { userAuth: { access_token } } = useContext(UserContext);

    // Function to fetch blogs from the server based on provided parameters
    const getBlogs = ({ page, draft, deletedDocCount = 0 }) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/user-written-blogs", {
            page, draft, query, deletedDocCount 
        }, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
        .then(async ({ data }) => {
            // Format fetched data using the pagination utility
            let formatedData = await filterPaginationData({
                state: draft ? drafts : blogs,
                data: data.blogs, 
                page,
                user: access_token,
                countRoute: "/user-written-blogs-count",
                data_to_send: { draft, query }
            });

            console.log("draft -> " + draft , formatedData);

            // Update the appropriate state based on whether the data is for drafts or published blogs
            if(draft){
                setDrafts(formatedData);
            } else{
                setBlogs(formatedData);
            }
        })
        .catch(err => {
            console.log(err);
        }); 
    };

    // Effect to fetch blogs and drafts on component mount or when dependencies change
    useEffect(() => {
        if(access_token){
            if(blogs == null){
                getBlogs({ page: 1, draft: false }); // Fetch published blogs
            }
            if(drafts == null){
                getBlogs({ page: 1, draft: true }); // Fetch draft blogs
            }
        }
    }, [access_token, blogs, drafts, query]);

    // Handle search input change and trigger blog fetching on Enter key
    const handleSearch = (e) => {
        let searchQuery = e.target.value;

        setQuery(searchQuery);

        if(e.keyCode == 13 && searchQuery.length){
            setBlogs(null); // Reset blogs state
            setDrafts(null); // Reset drafts state
        }
    };

    // Handle clearing of search input
    const handleChange = (e) => {
        if(!e.target.value.length){
            setQuery(""); // Clear the search query
            setBlogs(null); // Reset blogs state
            setDrafts(null); // Reset drafts state
        }
    };
    
    return (
        <>
            {/* Page heading */}
            <h1 className="max-md:hidden">Manage Blogs</h1>

            {/* Toast notifications */}
            <Toaster />

            {/* Search input */}
            <div className="relative max-md:mt-5 md:mt-8 mb-10">
                <input 
                    type="search"
                    className="w-full bg-grey p-4 pl-12 pr-6 rounded-full placeholder:text-dark-grey"
                    placeholder="Search Blogs"
                    onChange={handleChange}
                    onKeyDown={handleSearch}
                />
                <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey "></i>
            </div>

            {/* Tabs for Published Blogs and Drafts */}
            <InPageNavigation routes={["Published Blogs", "Drafts"]} defaultActiveIndex={ activeTab != 'draft' ? 0 : 1 }>

                {/* Published Blogs Section */}
                {
                    blogs == null ? <Loader /> :
                    blogs.results.length ? 
                       <>
                        {
                            blogs.results.map((blog, i) => {
                                return <AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
                                    {/* Render each published blog card */}
                                    <ManagePublishedBlogCard blog={{ ...blog, index: i, setStateFunc: setBlogs }} />
                                </AnimationWrapper>
                            })
                        }
                        {/* Load more button for published blogs */}
                        <LoadMoreDataBtn state={blogs} fetchDataFun={getBlogs} additionalParam={{ draft: false, deletedDocCount: blogs.deletedDocCount }} />
                       </>
                    : <NoDataMessage message="No published blogs" /> // No published blogs message
                }

                {/* Draft Blogs Section */}
                {
                    drafts == null ? <Loader /> :
                    drafts.results.length ? 
                    <>
                        {
                            drafts.results.map((blog, i) => {
                                return <AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
                                    {/* Render each draft blog card */}
                                    <ManageDraftBlogPost blog={{ ...blog, index: i, setStateFunc: setDrafts }} />
                                </AnimationWrapper>
                            })
                        }
                        {/* Load more button for draft blogs */}
                        <LoadMoreDataBtn state={drafts} fetchDataFun={getBlogs} additionalParam={{ draft: true, deletedDocCount: drafts.deletedDocCount }} />
                    </>
                    : <NoDataMessage message="No draft blogs" /> // No draft blogs message
                }
            </InPageNavigation>
        </>
    );
};

export default ManageBlogs;
