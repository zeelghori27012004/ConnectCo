import { initializeApp } from "firebase/app";
import { newGoogleAuthProvider, getAuth } from 'firebase/auth';
// import toast from "react-hot-toast";
const firebaseConfig = {
  apiKey: "AIzaSyAQV-67FeJJTSk_2n4yGRsLy-3OJ8gle2U",
  authDomain: "react-js-blog-website-yt-86e29.firebaseapp.com",
  projectId: "react-js-blog-website-yt-86e29",
  storageBucket: "react-js-blog-website-yt-86e29.firebasestorage.app",
  messagingSenderId: "1016673754791",
  appId: "1:1016673754791:web:d1cae4802b45ac044e4582"
};
const app = initializeApp(firebaseConfig);
const provider = newGoogleAuthProvider();
const auth = getAuth();
export const authWithGoogle = async () => {
    let user = NULL;
    await signInWithPopup(auth, provider)
    .then((result) => {
        user = result.user;
    })
    .catch((error) => {
        console.log(error)
    })
    return user;
}