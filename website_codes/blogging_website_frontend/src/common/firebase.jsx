import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAqo_rhS_CiseynT2ncpEHwWc3TPjhAtLk",
  authDomain: "connectco-55bb8.firebaseapp.com",
  projectId: "connectco-55bb8",
  storageBucket: "connectco-55bb8.firebasestorage.app",
  messagingSenderId: "543736069418",
  appId: "1:543736069418:web:bc4f52c537990d6d277253"
};

const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {

    let user = null;

    await signInWithPopup(auth, provider)
    .then((result) => {
        user = result.user
    })
    .catch((err) => {
        console.log(err)
    })

    return user;
}