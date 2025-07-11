import {
  checkNewNotificationsService,
  getNotificationsService,
  getNotificationsCountService
} from "../services/notification.service.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

export const checkNewNotifications = async (req, res) => {
  try {
    const user_id = req.user;
    const hasNew = await checkNewNotificationsService(user_id);
    res.status(200).json({ new_notification_available: hasNew });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const user_id = req.user;
    const { page, filter, deletedDocCount } = req.body;
    const notifications = await getNotificationsService(user_id, page, filter, deletedDocCount);
    res.status(200).json({ notifications });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getNotificationsCount = async (req, res) => {
  try {
    const user_id = req.user;
    const { filter } = req.body;
    const count = await getNotificationsCountService(user_id, filter);
    res.status(200).json({ totalDocs: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};