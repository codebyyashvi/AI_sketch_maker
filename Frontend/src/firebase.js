import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCW-4KPsovJCo0etwWCbxrjwl_ZM1A3_Oc",
  authDomain: "ai-sketch-maker.firebaseapp.com",
  projectId: "ai-sketch-maker",
  storageBucket: "ai-sketch-maker.firebasestorage.app",
  messagingSenderId: "1090190324934",
  appId: "1:1090190324934:web:2f96c8fe58f81aaa3613c7",
  measurementId: "G-9W1GG45SSC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth and Provider
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export default app;
