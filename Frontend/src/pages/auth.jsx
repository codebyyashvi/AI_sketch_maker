import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { initializeApp, getApps, getApp } from "firebase/app";


// TODO: Replace with your Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: "ai-sketch-maker.firebaseapp.com",
  projectId: "ai-sketch-maker",
  storageBucket: "ai-sketch-maker.firebasestorage.app",
  messagingSenderId: "1090190324934",
  appId: "1:1090190324934:web:2f96c8fe58f81aaa3613c7",
  measurementId: "G-9W1GG45SSC"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function WelcomePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-xl text-center"
      >
        <h1 className="text-5xl font-bold mb-6">AI Sketch Maker</h1>
        <p className="text-lg text-gray-300 mb-10">
          Transform your imagination into stunning sketches using AI.
        </p>

        {!user ? (
          <>
            <Button
              onClick={handleGoogleLogin}
              className="px-6 py-3 text-lg rounded-2xl shadow-xl"
            >
              Sign In with Google
            </Button>
            <p className="mt-4 text-gray-400 text-sm">
              You must sign in before accessing the Sketch Maker.
            </p>
          </>
        ) : (
          <>
            <p className="mb-6 text-green-400">Welcome, {user.displayName}!</p>
            <Button
              onClick={() => (window.location.href = "/sketch-maker")}
              className="px-6 py-3 text-lg rounded-2xl shadow-xl"
            >
              Go to Sketch Maker
            </Button>
          </>
        )}
      </motion.div>
    </div>
  );
}
