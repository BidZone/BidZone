import React, { useState, useEffect } from "react";
import AuctionCreateForm from "./AuctionCreateForm";
import './AuctionsPage.css';
import { useAuth } from "../contexts/AuthContext";

const AuctionsPage = () => {
    const { isAuthenticated } = useAuth();
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedAuction, setSelectedAuction] = useState(null);
    const [bidAmount, setBidAmount] = useState(""); // Stores the entered bid amount
    const [feedback, setFeedback] = useState(""); // Feedback for bid/buy actions

    const handleToggleForm = () => {
        setShowForm(!showForm);
    };

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/auctions/`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setAuctions(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAuctions();
    }, []);

    const handleAuctionClick = async (id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/aukcija/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setSelectedAuction(data);
        } catch (err) {
            console.error("Error fetching auction details:", err);
        }
    };

    const closePopup = () => {
        setSelectedAuction(null);
        setBidAmount("");
        setFeedback("");
    };

    const handleBuyNow = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/buy_now/${selectedAuction.id_aukcije}/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });
    
            if (!response.ok) {
                throw new Error("Failed to complete the purchase.");
            }
    
            const data = await response.json();
            setFeedback(data.message || "Purchase successful!");
    
            // Refresh the page after a successful purchase
            setTimeout(() => {
                window.location.reload();
            }, 1000); // Add a delay for user feedback visibility
        } catch (err) {
            setFeedback(`Error: ${err.message}`);
        }
    };
    

    const handleBidSubmit = async () => {
        const minBid = selectedAuction.najveca_ponuda || selectedAuction.pocetna_cijena;

        if (parseFloat(bidAmount) <= parseFloat(minBid)) {
            setFeedback(`Your bid must be higher than ${minBid}€.`);
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/bidanje/${selectedAuction.id_aukcije}/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
                body: JSON.stringify({ amount: parseFloat(bidAmount) }),
            });

            if (!response.ok) {
                throw new Error("Failed to place the bid.");
            }

            const data = await response.json();
            setFeedback(data.message || "Bid placed successfully!");
            setSelectedAuction((prev) => ({ ...prev, najveca_ponuda: parseFloat(bidAmount) }));
            setBidAmount("");
        } catch (err) {
            setFeedback(`Error: ${err.message}`);
        }
    };

    return (
        <div className="auctions-page">
            <h1>Auctions</h1>

            {isAuthenticated && (
                <button className="create-auction-btn" onClick={handleToggleForm}>
                    {showForm ? "Close Form" : "Create Auction"}
                </button>
            )}

            {showForm && <AuctionCreateForm />}

            <h2>Current Auctions</h2>
            {loading && <p>Loading auctions...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            <div className="auction-list">
                {auctions.map((auction) => {
                    // Remove "image/upload/" from the URL if it exists
                    let fixedSlika = auction.slika;
                    if (fixedSlika && fixedSlika.includes("image/upload/")) {
                        fixedSlika = fixedSlika.replace("image/upload/", "");
                    }

                    return (
                        <div
                            key={auction.id_aukcije}
                            className="auction-item"
                            onClick={() => handleAuctionClick(auction.id_aukcije)}
                        >
                            <h3>{auction.naziv}</h3>
                            <p><strong>Starting Price:</strong> ${auction.pocetna_cijena}</p>
                            {auction.buy_now_cijena && (
                                <p><strong>Buy Now Price:</strong> ${auction.buy_now_cijena}</p>
                            )}
                            <p><strong>Info:</strong> {auction.informacije}</p>
                            <p><strong>Date:</strong> {new Date(auction.datum).toLocaleDateString()}</p>
                            <img src={fixedSlika || "https://via.placeholder.com/150"} alt={auction.naziv} className="auction-image" />
                        </div>
                    );
                })}
            </div>



            {selectedAuction && (
                <div className="popup-overlay">
                    <div className="auction-popup">
                        <div className="close-button" onClick={closePopup}>
                            <i className="fas fa-times"></i>
                        </div>
                        <div className="popup-content">
                            <img src={selectedAuction.slika || ""} alt={selectedAuction.naziv} className="popup-image" />
                            <h3>{selectedAuction.naziv}</h3>
                            <p><strong>{selectedAuction.najveca_ponuda ? "Highest Bid" : "Starting Price"}:</strong> ${selectedAuction.najveca_ponuda || selectedAuction.pocetna_cijena}</p>
                            {selectedAuction.buy_now_cijena && (
                                <button className="btn btn-primary" onClick={handleBuyNow}>
                                    Buy Now: ${selectedAuction.buy_now_cijena}
                                </button>
                            )}
                            <div className="bid-section">
                                <input
                                    type="number"
                                    id="bidAmount"
                                    className="form-control"
                                    placeholder="Enter bid"
                                    value={bidAmount}
                                    onChange={(e) => setBidAmount(e.target.value)}
                                />
                                <button className="btn btn-success mt-2" onClick={handleBidSubmit}>
                                    Place Bid
                                </button>
                            </div>
                            {feedback && <p className="feedback mt-3">{feedback}</p>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuctionsPage;
