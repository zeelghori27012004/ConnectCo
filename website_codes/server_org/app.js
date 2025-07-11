import express from "express";
import connectDB from "./config/database.js";
import corsMiddleware from "./middlewares/cors.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import userRoutes from "./routes/user.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import utilRoutes from "./routes/util.routes.js";
import "dotenv/config";

const server = express();
const PORT = process.env.PORT || 3000;

// Middlewares
server.use(express.json());
server.use(corsMiddleware);

// Database connection
connectDB();

// Routes
server.use("/", authRoutes);
server.use("/", blogRoutes);
server.use("/", userRoutes);
server.use("/", commentRoutes);
server.use("/", notificationRoutes);
server.use("/", utilRoutes);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});