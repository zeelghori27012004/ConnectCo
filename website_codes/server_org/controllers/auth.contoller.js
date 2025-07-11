import {
  registerUser,
  authenticateUser,
  authenticateWithGoogle,
  changePasswordService
} from "../services/auth.service.js";
import { emailRegex, passwordRegex } from "../utils/helpers.js";

export const signup = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    if (fullname.length < 3) {
      return res.status(403).json({ error: "Fullname must be at least 3 letters long" });
    }
    if (!emailRegex.test(email)) {
      return res.status(403).json({ error: "Email is invalid" });
    }
    if (!passwordRegex.test(password)) {
      return res.status(403).json({
        error: "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters",
      });
    }

    const user = await registerUser({ fullname, email, password });
    res.status(200).json(formatDatatoSend(user));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authenticateUser(email, password);
    res.status(200).json(user);
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { access_token } = req.body;
    const user = await authenticateWithGoogle(access_token);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user;

    if (!passwordRegex.test(currentPassword) || !passwordRegex.test(newPassword)) {
      return res.status(403).json({
        error: "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters",
      });
    }

    await changePasswordService(userId, currentPassword, newPassword);
    res.status(200).json({ status: "password changed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};