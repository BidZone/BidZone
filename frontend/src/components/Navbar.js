import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const [showBalanceDropdown, setShowBalanceDropdown] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState(""); // "withdraw" or "deposit"
  const [amount, setAmount] = useState(""); // Stores the entered amount
  const [message, setMessage] = useState(""); // Message for feedback

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleBalanceClick = () => {
    setShowBalanceDropdown(!showBalanceDropdown);
  };

  const handlePopupOpen = (type) => {
    setPopupType(type);
    setShowPopup(true);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    setPopupType("");
    setAmount(""); // Clear the amount input
    setMessage(""); // Clear the feedback message
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear any previous message

    const endpoint = popupType === "withdraw" ? "/api/users/withdraw/" : "/api/users/deposit/";
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ amount: parseFloat(amount) }),
      });

      if (!response.ok) {
        throw new Error("Failed to process the request.");
      }

      const data = await response.json();
      setMessage(`Success: ${data.message || "Operation completed."}`);
      setAmount(""); // Clear the input after successful submission
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container d-flex align-items-center">
          <Link className="navbar-brand" to="/">
            BidZone
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto d-flex align-items-center">
              {isAuthenticated ? (
                <>
                  <li className="nav-item dropdown">
                    <button
                      className="btn btn-link nav-link dropdown-toggle"
                      onClick={handleBalanceClick}
                      style={{ cursor: "pointer" }}
                    >
                      Balance
                    </button>
                    {showBalanceDropdown && (
                      <ul className="dropdown-menu show">
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handlePopupOpen("withdraw")}
                          >
                            Withdraw
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handlePopupOpen("deposit")}
                          >
                            Deposit
                          </button>
                        </li>
                      </ul>
                    )}
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/auctions">
                      Auctions
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/profile">
                      Profile
                    </Link>
                  </li>
                  <li className="nav-item">
                    <button
                      className="btn btn-link nav-link"
                      onClick={logout}
                      style={{ cursor: "pointer" }}
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/auctions">
                      Auctions
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register">
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button
              className="close-button"
              onClick={handlePopupClose}
              aria-label="Close"
            >
              &times;
            </button>
            <h3>{popupType === "withdraw" ? "Withdraw Funds" : "Deposit Funds"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="amount">Amount:</label>
                <input
                  type="number"
                  id="amount"
                  className="form-control"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary mt-3">
                Confirm
              </button>
            </form>
            {message && <p className="mt-3">{message}</p>}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
