import {
  searchUsersService,
  getUserProfileService,
  updateProfileImageService,
  updateProfileService
} from "../services/user.service.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.body;
    const users = await searchUsersService(query);
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await getUserProfileService(username);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProfileImg = async (req, res) => {
  try {
    const user_id = req.user;
    const { url } = req.body;
    await updateProfileImageService(user_id, url);
    res.status(200).json({ profile_img: url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user_id = req.user;
    const profileData = req.body;
    const username = await updateProfileService(user_id, profileData);
    res.status(200).json({ username });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "username is already taken" });
    }
    res.status(500).json({ error: err.message });
  }
};