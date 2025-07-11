import admin from "firebase-admin";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const serviceAccountKey = require('./connectco-55bb8-firebase-adminsdk-fbsvc-14d2ea094a.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});

export const auth = admin.auth();
export default admin;