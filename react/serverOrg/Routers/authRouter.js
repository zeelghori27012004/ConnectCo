import express from "express";
import { signin, signup } from "../Controllers/authController.js";

const router = express.Router();

router.post("/signin", signin);
router.post("/signup",signup);
//router.post("/google-auth",google_auth);

export default router;