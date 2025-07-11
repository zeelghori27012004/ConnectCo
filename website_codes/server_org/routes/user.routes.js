import express from "express";
import {
  searchUsers,
  getProfile,
  updateProfileImg,
  updateProfile
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/search-users", searchUsers);
router.post("/get-profile", getProfile);
router.post("/update-profile-img", verifyJWT, updateProfileImg);
router.post("/update-profile", verifyJWT, updateProfile);

export default router;