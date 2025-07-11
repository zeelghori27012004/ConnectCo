import express from "express";
import {
  signup,
  signin,
  googleAuth,
  changePassword
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google-auth", googleAuth);
router.post("/change-password", verifyJWT, changePassword);

export default router;