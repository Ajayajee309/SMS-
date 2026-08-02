// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDsukmPt1Vy17E4KlcJJVLALVHV2pFMOAc",
  authDomain: "studentmanagementsystem-30.firebaseapp.com",
  projectId: "studentmanagementsystem-30",
  storageBucket: "studentmanagementsystem-30.firebasestorage.app",
  messagingSenderId: "47680011633",
  appId: "1:47680011633:web:3395b32041d95ddd7b8ad0",
  measurementId: "G-MPLKSW24K1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };