import React from 'react'

const BlogPostCard = ({content,author}) => {

    let {publishedAt, tags, title, des, banner, activity:{total_likes}, blog_id:id}=content;
    let {fullname, profile_img, username} = author;
  return (
    <div className='w-full'>
        <div className='flex gap-2 items-center mb-7'>
            <img src={profile_img} className='w-6 h-6 rounded-full' />
        </div>
    </div>
  )
}

export default BlogPostCard
