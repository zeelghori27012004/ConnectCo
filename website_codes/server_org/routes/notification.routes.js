import express from "express";
import {
  checkNewNotifications,
  getNotifications,
  getNotificationsCount
} from "../controllers/notification.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/new-notification", verifyJWT, checkNewNotifications);
router.post("/notifications", verifyJWT, getNotifications);
router.post("/all-notifications-count", verifyJWT, getNotificationsCount);

export default router;