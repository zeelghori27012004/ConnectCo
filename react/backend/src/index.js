import express from 'express';
import mongoose from 'mongoose';
import Connection from './db.js';
import dotenv from 'dotenv';





const server = express();
let PORT = 3000;

server.listen(PORT,()=>{
    console.log('listening on port-> '+PORT);
})


dotenv.config();
const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;

Connection(USERNAME, PASSWORD);

