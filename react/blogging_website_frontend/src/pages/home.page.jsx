// import React from 'react'
import axios from 'axios';
import AnimationWrapper from '../common/page-animation';
import InPageNavigation from '../components/inpage-navigation.component';

const HomePage = () => {
    
    const fetchLatestBlogs = () => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs")
        .then(({blogs}) => {
            console.log(blogs);
        })
        .catch(err => {
            console.log(err);
        })
    }
  return (
    <AnimationWrapper>
        <section className='h-cover flex justify-center gap-10'>
            {/* latest blogs  */}
            <div className='w-full'>
                <InPageNavigation routes={["home","trending blogs"]} defaultHidden={["trending blogs"]}>
                    <h1>Latest Blogs here</h1>
                    <h1>Trending Blogs here</h1>
                </InPageNavigation>
            </div>
            {/* filters and trending blogs */}
            <div>

            </div>
        </section>
    </AnimationWrapper>
  )
}

export default HomePage;
