import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage";
import { useAuthStore } from "./store/useAuthStore";
import { Toaster } from "react-hot-toast";
import { LoaderOne } from "./components/ui/loader";

function App() {
  const { checkauth, authUser, isCheckingAuth, onlineUsers } = useAuthStore();
  console.log(onlineUsers);
  
  useEffect(() => {
    checkauth();
  }, [checkauth]);
  if (!authUser && isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen text-2xl">
        <LoaderOne />
      </div>
    );
  }
  return (
    <>
      <Toaster />
      <Navbar />
      <Routes>
        <Route path="*" element={<NotFoundPage />} />
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </>
  );
}

export default App;
