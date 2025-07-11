import bcrypt from "bcrypt";
import User from "../models/User.js";
import { generateUsername, formatDatatoSend } from "../utils/helpers.js";
import { auth } from "../config/firebase.js";

export const registerUser = async (userData) => {
  const { fullname, email, password } = userData;
  const hashed_password = await bcrypt.hash(password, 10);
  const username = await generateUsername(email, User);
  
  const user = new User({
    personal_info: { fullname, email, password: hashed_password, username },
  });
  
  return await user.save();
};

export const authenticateUser = async (email, password) => {
  const user = await User.findOne({ "personal_info.email": email });
  if (!user) throw new Error("Email not found");
  
  if (user.google_auth) {
    throw new Error("Account was created using google. Try logging in with google.");
  }

  const isMatch = await bcrypt.compare(password, user.personal_info.password);
  if (!isMatch) throw new Error("Incorrect password");
  
  return formatDatatoSend(user);
};

export const authenticateWithGoogle = async (access_token) => {
  const decodedUser = await auth.verifyIdToken(access_token);
  const { email, name, picture } = decodedUser;
  const profile_img = picture.replace("s96-c", "s384-c");

  let user = await User.findOne({ "personal_info.email": email })
    .select("personal_info.fullname personal_info.username personal_info.profile_img google_auth");

  if (!user) {
    const username = await generateUsername(email, User);
    user = new User({
      personal_info: { fullname: name, email, username, profile_img },
      google_auth: true,
    });
    await user.save();
  } else if (!user.google_auth) {
    throw new Error("This email was signed up without google. Please log in with password");
  }

  return formatDatatoSend(user);
};