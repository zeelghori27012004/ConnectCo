import express from "express";
import { verifyJWT } from "../Middlewares/authMiddleware.js";
import { notification, new_notification, all_notifications_count } from "../Controllers/notificationController.js";



const router = express.Router();

router.post("/new-notification", verifyJWT,new_notification);
router.post("/notifications", verifyJWT,notification);
router.post("/all-notifications-count", verifyJWT,all_notifications_count);

export default router