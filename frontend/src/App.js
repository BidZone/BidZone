import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import AuctionsPage from "./components/AuctionsPage";
import EmailVerified from "./components/EmailVerified";
import { AuthProvider } from "./contexts/AuthContext"; // Import AuthProvider

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <Routes>
            <Route path="*" element={<h1>Page Not Found</h1>} />
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
