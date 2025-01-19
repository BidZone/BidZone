import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const [showBalanceDropdown, setShowBalanceDropdown] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState(""); // "withdraw" or "deposit"
  const [amount, setAmount] = useState(""); // Stores the entered amount
  const [iban, setIban] = useState(""); // Stores the IBAN (withdraw)
  const [cardNumber, setCardNumber] = useState(""); // Stores the card number (deposit)
  const [cardError, setCardError] = useState(""); // Error message for invalid card number
  const [message, setMessage] = useState(""); // Message for feedback
  const [balance, setBalance] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchBalance = async () => {
      if (isAuthenticated) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/users/balance/`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();
            setBalance(data.balance);
          } else {
            console.error("Failed to fetch balance.");
          }
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      }
    };

    fetchBalance();
  }, [isAuthenticated, API_BASE_URL]);

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
    setIban(""); // Clear the IBAN field
    setCardNumber(""); // Clear the card number field
    setCardError(""); // Clear card validation errors
    setMessage(""); // Clear the feedback message
  };

  const handleCardNumberChange = (e) => {
    const input = e.target.value;
    const sanitizedInput = input.replace(/\s+/g, ""); // Remove all whitespaces
    setCardNumber(input); // Preserve the user's formatting

    // Validate card number: must be 16 digits
    if (sanitizedInput.length === 16 && /^\d{16}$/.test(sanitizedInput)) {
      setCardError("");
    } else {
      setCardError("Invalid card number!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear any previous message

    if (popupType === "deposit" && cardError) {
      setMessage("Please correct the card number before proceeding.");
      return;
    }

    const endpoint = popupType === "withdraw" ? "/api/users/withdraw/" : "/api/users/deposit/";
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ amount: parseFloat(amount) }),
      });

      if (!response.ok) {
        throw new Error("Failed to process the request.");
      }

      const data = await response.json();
      setMessage(`Success: ${data.message || "Operation completed."}`);
      setAmount(""); // Clear the input after successful submission

      // Update balance immediately on successful response
      if (popupType === "withdraw") {
        setBalance((prevBalance) => prevBalance - parseFloat(amount));
      } else if (popupType === "deposit") {
        setBalance((prevBalance) => prevBalance + parseFloat(amount));
      }
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
                      Balance: {balance !== null ? `${balance} €` : "Loading..."}
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
            <div
              className="close-button"
              onClick={handlePopupClose}
              aria-label="Close"
            >
              <i className="fas fa-times"></i> {/* FontAwesome X icon */}
            </div>
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
              {popupType === "withdraw" && (
                <div className="form-group">
                  <label htmlFor="iban">Enter IBAN:</label>
                  <input
                    type="text"
                    id="iban"
                    className="form-control"
                    placeholder="Enter IBAN"
                    value={iban}
                    onChange={(e) => setIban(e.target.value)}
                  />
                </div>
              )}
              {popupType === "deposit" && (
                <div className="form-group">
                  <label htmlFor="card-number">Enter Card Number:</label>
                  <input
                    type="text"
                    id="card-number"
                    className="form-control"
                    placeholder="Enter Card Number"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                  />
                  {cardError && <p className="text-danger mt-1">{cardError}</p>}
                </div>
              )}
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
