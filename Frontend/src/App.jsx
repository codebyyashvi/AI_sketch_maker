import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import WelcomePage from "./pages/auth";
import SketchMaker from "./pages/SketchMaker";
// import ImageEditor from "./pages/ImageEditor";

// -------- Protected Route Wrapper ----------
function ProtectedRoute({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  if (user === undefined) {
    return <div className="text-white text-center p-10">Loading...</div>;
  }

  return user ? children : <Navigate to="/" />;
}

// -------------- Main App -------------------
export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<WelcomePage />} />

        {/* Protected Routes */}
        <Route
          path="/sketch-maker"
          element={
            <ProtectedRoute>
              <SketchMaker />
            </ProtectedRoute>
          }
        />

        {/* <Route
          path="/edit"
          element={
            <ProtectedRoute>
              <ImageEditor />
            </ProtectedRoute>
          }
        /> */}

        {/* For unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
