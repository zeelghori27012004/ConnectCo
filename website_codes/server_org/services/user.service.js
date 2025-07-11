import User from "../models/User.js";
import Blog from "../models/Blog.js";
import { BIO_LIMIT } from "../utils/constants.js";

export const searchUsersService = async (query) => {
  return await User.find({ "personal_info.username": new RegExp(query, "i") })
    .limit(50)
    .select("personal_info.fullname personal_info.username personal_info.profile_img -_id");
};

export const getUserProfileService = async (username) => {
  return await User.findOne({ "personal_info.username": username })
    .select("-personal_info.password -google_auth -updatedAt -blogs");
};

export const updateProfileImageService = async (user_id, url) => {
  await User.findOneAndUpdate(
    { _id: user_id },
    { "personal_info.profile_img": url }
  );
};

export const updateProfileService = async (user_id, { username, bio, social_links }) => {
  if (username.length < 3) {
    throw new Error("Username should be at least 3 letters long");
  }

  if (bio.length > BIO_LIMIT) {
    throw new Error(`Bio should not be more than ${BIO_LIMIT} characters`);
  }

  const socialLinksArr = Object.keys(social_links);
  for (let i = 0; i < socialLinksArr.length; i++) {
    if (social_links[socialLinksArr[i]].length) {
      try {
        const hostname = new URL(social_links[socialLinksArr[i]]).hostname;
        if (
          !hostname.includes(`${socialLinksArr[i]}.com`) &&
          socialLinksArr[i] != "website"
        ) {
          throw new Error(`${socialLinksArr[i]} link is invalid`);
        }
      } catch (err) {
        throw new Error("You must provide full social links with http(s) included");
      }
    }
  }

  const updateObj = {
    "personal_info.username": username,
    "personal_info.bio": bio,
    social_links,
  };

  await User.findOneAndUpdate({ _id: user_id }, updateObj, {
    runValidators: true,
  });

  return username;
};