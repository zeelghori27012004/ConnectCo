# ConnectCo 

**ConnectCo** is a modern, community-driven blogging platform designed to bring together users—especially introverts—through expressive, personalized content. While blogs may seem old-fashioned, they remain one of the most powerful ways to share your thoughts, ideas, and identity. Our goal is to channel this power into building a connected community centered around our college.

## Live Demo

Frontend : https://connectco-frontend.onrender.com

Backend : https://connectco-0sw5.onrender.com

##  Features

###  Core Platform Features
- **User Management**: Secure sign-up/sign-in with Google Authentication and password management.
- **Blog Post Management**: Create, edit, publish, and delete blogs easily with a modern interface.
- **Social Sharing**: Share your thoughts and stories with the world via built-in social sharing tools.
- **Commenting System**: Engage with readers through nested comments and replies.
- **Follow & Notification System**: Stay updated with content from users you follow. Every interaction generates a notification.
- **Club & Committee Engagement**: A platform that allows clubs and college committees to post and engage with students.
- **College Admin Panel**: A dedicated space for college administration to manage and moderate content.

###  Blog Writing & Interaction
- **Editor.js Integration**: Rich-text, block-style blog editor for beautiful and structured content creation.
- **Dynamic Blog Pages**: Each blog has its own unique URL.
- **Search Functionality**: Find blogs or users effortlessly.
- **Like & Comment**: Interact with blogs through likes and comments.
- **Nested Commenting**: Support for threaded replies to comments.
- **Blog Analytics**: Track views and engagement on your posts.

###  User Profile & Dashboard
- **Personal Profiles**: Showcase your social links, bio, and published blogs.
- **Custom Dashboard**: Manage all your drafts and published blogs in one place.
- **Profile Editing**: Update your username, bio, social links, and password.
- **Notification Center**: Highlights new notifications to keep you updated.

###  UI & UX
- **Mobile Responsive Design**: Smooth and modern UI for all screen sizes.
- **Fade-in Animations**: Enhance user experience with beautiful transitions.
- **Dark Mode & Theming** *(Optional enhancement idea)*

##  Tech Stack

- **Frontend**: React.js, TailwindCSS, HTML, JavaSCript
- **Backend**: Node.js, Express.js, google firebase authentication
- **Database**: MongoDB (Mongoose), AWS(Amazon Web Services) S3 bucket
- **Authentication**: Google OAuth, JWT



##  Installation

### Prerequisites
- Node.js and npm installed
- MongoDB instance or cluster (e.g., MongoDB Atlas)

### Clone the Repository

git clone https://github.com/zeelghori27012004/ConnectCo
cd ConnectCo
cd website_codes

### Enviornment variables

Create a .env file in the root of your backend directory with:
DB_LOCATION=
SECRET_ACCESS_KEY=
AWS_SECRET_ACCESS_KEY=
AWS_ACCESS_KEY=
AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE=


### Setup Backend

cd server
npm install
node server.js

### Setup Frontend

cd blogging_website_frontend
npm install
npm run dev


