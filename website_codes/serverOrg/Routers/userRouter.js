import { search_user, get_profile, update_profile_img, update_profile, change_password, user_written_blogs, user_written_blogs_count} from "../Controllers/userController.js";
import  {verifyJWT}  from "../Middlewares/authMiddleware.js";
import express from "express";


const router = express.Router();

router.post("/search-users",search_user);
router.post("/get-profile",get_profile);
router.post("/update-profile-img", verifyJWT, update_profile_img);
router.post("/update-profile", verifyJWT,update_profile);
router.post("/change-password", verifyJWT ,change_password);
router.post("/user-written-blogs", verifyJWT,user_written_blogs);
router.post("/user-written-blogs-count", verifyJWT, user_written_blogs_count);


export default router;