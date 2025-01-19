import React, { useEffect } from 'react';
import './App.css';
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import AuctionsPage from "./components/AuctionsPage";
import EmailVerified from "./components/EmailVerified";
import MainPage from "./components/MainPage"; // Import MainPage component
import { AuthProvider } from "./contexts/AuthContext"; // Import AuthProvider


const App = () => {
  const location = useLocation();

  useEffect(() => {
    // Apply specific scrolling behavior for login page
    if (location.pathname === "/login") {
      document.body.classList.add("scroll-hidden");
      document.body.classList.remove("scroll-auto");
    } else {
      document.body.classList.add("scroll-auto");
      document.body.classList.remove("scroll-hidden");
    }

    // Cleanup on unmount or route change
    return () => {
      document.body.classList.remove("scroll-hidden", "scroll-auto");
    };
  }, [location.pathname]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} /> {/* Add Main Page route */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auctions" element={<AuctionsPage />} />
        <Route path="/email-verified" element={<EmailVerified />} />

      </Routes>
    </div>
  );
};

const AppWithRouter = () => (
  <Router>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Router>
);

export default AppWithRouter;
