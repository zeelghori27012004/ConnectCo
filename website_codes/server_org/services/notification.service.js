import Notification from "../models/Notification.js";
import { MAX_NOTIFICATION_LIMIT } from "../utils/constants.js";

export const checkNewNotificationsService = async (user_id) => {
  return await Notification.exists({
    notification_for: user_id,
    seen: false,
    user: { $ne: user_id },
  });
};

export const getNotificationsService = async (user_id, page, filter, deletedDocCount) => {
  let findQuery = { notification_for: user_id, user: { $ne: user_id } };
  if (filter != "all") findQuery.type = filter;

  let skipDocs = (page - 1) * MAX_NOTIFICATION_LIMIT;
  if (deletedDocCount) skipDocs -= deletedDocCount;

  const notifications = await Notification.find(findQuery)
    .skip(skipDocs)
    .limit(MAX_NOTIFICATION_LIMIT)
    .populate("blog", "title blog_id")
    .populate("user", "personal_info.fullname personal_info.username personal_info.profile_img")
    .populate("comment", "comment")
    .populate("replied_on_comment", "comment")
    .populate("reply", "comment")
    .sort({ createdAt: -1 })
    .select("createdAt type seen reply");

  await Notification.updateMany(findQuery, { seen: true })
    .skip(skipDocs)
    .limit(MAX_NOTIFICATION_LIMIT);

  return notifications;
};

export const getNotificationsCountService = async (user_id, filter) => {
  let findQuery = { notification_for: user_id, user: { $ne: user_id } };
  if (filter != "all") findQuery.type = filter;

  return await Notification.countDocuments(findQuery);
};