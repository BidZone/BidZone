import React from 'react';
import './App.css';
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import AuctionsPage from "./components/AuctionsPage";
import EmailVerified from "./components/EmailVerified";
import MainPage from "./components/MainPage"; // Import MainPage component
import { AuthProvider } from "./contexts/AuthContext"; // Import AuthProvider

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <Routes>
            <Route path="/" element={<MainPage />} /> {/* Add Main Page route */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auctions" element={<AuctionsPage />} />
            <Route path="/email-verified" element={<EmailVerified />} /> {/* OVDJE ISPRAVKA */}
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;