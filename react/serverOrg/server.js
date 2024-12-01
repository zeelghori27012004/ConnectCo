import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';
import cors from 'cors';
import admin from 'firebase-admin';
//import serviceAccountKey from './react-js-blog-website-yt-86e29-firebase-adminsdk-eovop-6e77711d08.json' assert { type: "json" }
import { getAuth } from "firebase-admin/auth";
import fs from 'fs';
const serviceAccountKey = JSON.parse(fs.readFileSync('./react-js-blog-website-yt-86e29-firebase-adminsdk-eovop-6e77711d08.json', 'utf8'));
import aws from 'aws-sdk';
import { ServerResponse } from 'http';


import authRouter from "./Routers/authRouter.js"
import blogRouter from "./Routers/blogRouter.js"
import userRouter from "./Routers/userRouter.js"
import notificationRouter from "./Routers/notificationRouter.js"


import LoginRouter from "./Routers/authRouter.js";

const server = express();
let PORT = process.env.PORT||3000;

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccountKey)
// })

mongoose.connect(process.env.DB_LOCATION, {
    autoIndex: true
})

server.use(express.json()); //Middle ware
server.use(cors())


server.use("/", authRouter); //////////
server.use("/",blogRouter); //////////
server.use("/",userRouter); //////
server.use("/",notificationRouter);
server.get("/", (req,res)=> {res.json("hello from backend")});

server.listen(PORT, () => {
    console.log('listening on port-> ' + PORT);
})
