import { generateUploadURL } from "../services/util.service.js";

export const getUploadURL = async (req, res) => {
  try {
    const url = await generateUploadURL();
    res.status(200).json({ uploadURL: url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};