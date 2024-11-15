import express from 'express';
import mongoose from 'mongoose';
//import Connection from './db.js';
import 'dotenv/config'
import User from './Schema/User.js';
import Blog from './Schema/Blog.js';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import admin from 'firebase-admin';
//import serviceAccountKey from './react-js-blog-website-yt-86e29-firebase-adminsdk-eovop-6e77711d08.json' assert { type: "json" }
import { getAuth } from "firebase-admin/auth";
import fs from 'fs';
const serviceAccountKey = JSON.parse(fs.readFileSync('./react-js-blog-website-yt-86e29-firebase-adminsdk-eovop-6e77711d08.json', 'utf8'));
import aws from 'aws-sdk';




const server = express();
let PORT = 3000;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey)
})

mongoose.connect(process.env.DB_LOCATION,{
    autoIndex : true
})

const s3 = new aws.S3({
    region: 'ap-south-1',
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})


const generateUploadURL = async () => {

    const date = new Date();
    const imageName = `${nanoid}-${date.getTime()}.jpeg`;

    return await s3.getSignedUrlPromise('putObject', {
        Bucket: 'connectco-bucket',
        Key: imageName,
        Expires: 1000,
        ContentType: "image/jpeg"
    })
}

server.use(express.json()); //Middle ware
server.use(cors())

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

const generateUsername = async(email)=>{
    let username = email.split("@")[0];
    let isUsernameNotUnique = await User.exists({ "personal_info.username": username }).then((result) => result)
    isUsernameNotUnique ? username += nanoid().substring(0, 5) : "";
    return username;
}

const formatDatatoSend = (user) => {
    const access_token = jwt.sign({ id: user._id }, process.env.SECRET_ACCESS_KEY)

    return {
        access_token,
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname
    }
}

server.get('/get-upload-url', (request, response) => {
    generateUploadURL().then(url => response.status(200).json({ uploadURL: url}))
    .catch(err => {
        console.log(err.message);
        return response.status(500).json({ error: err.message})
    })
})

server.post("/signup",(req,res)=>{
 
    console.log(req.body);
    let {fullname , email, password} = req.body;

    if(fullname.length < 3){
        return res.status(403).json({"error": "Fullname must be atleast 3 letters long"})
    }
    if(!email.length){
        return res.status(403).json({"error": "Enter Email"})
    }
    if(!emailRegex.test(email)){
        return res.status(403).json({"error": "Email is invalid"})
    }
    if(!passwordRegex.test(password)){
        return res.status(403).json({"error": "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letter"})
    }
    bcrypt.hash(password, 10,async (err, hashed_password)=>{
        let username = await generateUsername(email);
        let user = new User({
            personal_info: {fullname, email, password: hashed_password, username }
        })
        user.save().then((u)=>{
            return res.status(200).json(formatDatatoSend(u))
        })
        .catch(err=>{
            if(err.code == 11000){
                return res.status(500).json({"error": "Email already exists - "+ err.message});
            }
            return res.status(500).json({"error": err.message})
        })
    })
    //return res.status(200).json({"status": "Loggend In"})
})

server.post("/signin",(req,res)=>{
    let {email ,password} = req.body;
    User.findOne({ "personal_info.email": email })
    .then((user)=>{
        if(!user){
            return res.status(403).json({"error": "Email not found"})
        }

        if(!user.google_auth){
            bcrypt.compare(password, user.personal_info.password, (err, result) => {

                if(err) {
                    return res.status(403).json({ "error": "Error occured while login please try again" });
                }
    
                if(!result){
                    return res.status(403).json({ "error": "Incorrect password" })
                } else{
                    return res.status(200).json(formatDatatoSend(user))
                }
    
            })
        }
        else{
            return res.status(403).json({"error": "Account was created using google.Try logging in with google."})
        }

    })
    .catch(err=>{
        console.log(err.message);
        return res.status(500).json({"error": err.message})
    })
})

server.post("/google-auth", async (req, res) => {

    let { access_token } = req.body;

    getAuth()
    .verifyIdToken(access_token)
    .then(async (decodedUser) => {

        let { email, name, picture } = decodedUser;

        picture = picture.replace("s96-c", "s384-c");

        let user = await User.findOne({"personal_info.email": email}).select("personal_info.fullname personal_info.username personal_info.profile_img google_auth").then((u) => {
            return u || null
        })
        .catch(err => {
            return res.status(500).json({ "error": err.message })
        })

        if(user) { // login
            if(!user.google_auth){
                return res.status(403).json({ "error": "This email was signed up without google. Please log in with password to access the account" })
            }
        }
        else { // sign up
            
            let username = await generateUsername(email);

            user = new User({
                personal_info: { fullname: name, email, username },
                google_auth: true
            })

            await user.save().then((u) => {
                user = u;
            })
            .catch(err => {
                return res.status(500).json({ "error": err.message })
            })

        }

        return res.status(200).json(formatDatatoSend(user))

    })
    .catch(err => {
        return res.status(500).json({ "error": "Failed to authenticate you with google. Try with some other google account" })
    })

})

const verifyJWT = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if(token == null){
        return res.status(401).json({ error: "No Access Token" })
    }

    jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, user) => {
        if(err){
            return res.status(403).json({ error: "Access Token Invalid" })
        }

        req.user = user.id;
        next();
    })
}

server.post('/create-blog', verifyJWT, (request, response) => {

    let authorId = request.user;

    let { title, des, banner, tags, content, draft } = request.body

    if(!title.length){
        return response.status(403).json({ error: "Provide a title" })
    }

    if(!draft){
        if(!des.length || des.length > 200){
            return response.status(403).json({ error: "Provide a description in maximum of 200 characters" })
        }
    
        if(!banner.length){
            return response.status(403).json({ error: "Provide a blog image" })
        }
    
        if(!content.blocks.length){
            return response.status(403).json({ error: "Provide some blog content" })
        }

        if(!tags.length || tags.length > 7){
            return response.status(403).json({ error: "Select some relatable tags, at max 7" })
        }
    }

    tags = tags.map(tag => tag.toLowerCase());

    let blog_id = title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, '-').trim() + nanoid();
    console.log(blog_id);

    let blog = new Blog({
        title, des, banner, content, tags, author: authorId, blog_id, draft: Boolean(draft)
    })

    blog.save().then(blog => {
        
        let incrementVal = draft ? 0 : 1;

        User.findOneAndUpdate({ _id: authorId }, { $inc: { "account_info.total_posts": incrementVal }, $push: { "blogs": blog._id } })
        .then(user => {
            return response.status(200).json({ id: blog.blog_id })
        })
        .catch(err => {
            return response.status(500).json({ error: "Failed to update post count" })
        })
    })
    .catch(err => {
        return response.status(500).json({ error: err.message })
    })

})

server.listen(PORT,()=>{
    console.log('listening on port-> '+PORT);
})  