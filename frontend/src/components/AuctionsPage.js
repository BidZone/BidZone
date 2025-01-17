import React, { useState, useEffect } from "react";
import AuctionCreateForm from "./AuctionCreateForm";
import './AuctionsPage.css';
import { useAuth } from "../contexts/AuthContext"; // Import AuthContext hook

const AuctionsPage = () => {
    const { isAuthenticated } = useAuth(); // Check authentication
    const [auctions, setAuctions] = useState([]); // State for auctions
    const [loading, setLoading] = useState(true); // Loading indicator state
    const [error, setError] = useState(null); // Error state
    const [showForm, setShowForm] = useState(false);
    const [selectedAuction, setSelectedAuction] = useState(null); // State for the selected auction (popup)

    const handleToggleForm = () => {
        setShowForm(!showForm);
    };

    // Fetch auction list
    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/auctions/`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setAuctions(data); // Set fetched data
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAuctions();
    }, []);

    // Handle auction click to fetch details for the popup
    const handleAuctionClick = async (id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/aukcija/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setSelectedAuction(data); // Set the fetched auction as the selected auction
        } catch (err) {
            console.error("Error fetching auction details:", err);
        }
    };

    // Close the popup
    const closePopup = () => {
        setSelectedAuction(null);
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
                    // Fix the URL if it contains 'image/upload/' followed by an invalid URL
                    let fixedSlika = auction.slika;
                    if (fixedSlika && fixedSlika.startsWith("image/upload/")) {
                        fixedSlika = fixedSlika.replace("image/upload/", "");
                    }

                    return (
                        <div
                            key={auction.id_aukcije}
                            className="auction-item"
                            onClick={() => handleAuctionClick(auction.id_aukcije)} // Click handler
                        >
                            <h3>{auction.naziv}</h3>
                            <p><strong>Starting Price:</strong> ${auction.pocetna_cijena}</p>
                            {auction.buy_now_cijena && (
                                <p><strong>Buy Now Price:</strong> ${auction.buy_now_cijena}</p>
                            )}
                            <p><strong>Info:</strong> {auction.informacije}</p>
                            <p><strong>Date:</strong> {new Date(auction.datum).toLocaleDateString()}</p>
                            <img src={fixedSlika} alt={auction.naziv} className="auction-image" />
                        </div>
                    );
                })}
            </div>

            {/* Popup for Selected Auction */}
            {selectedAuction && (
                <div className="auction-popup">
                    <button className="close-popup" onClick={closePopup}>X</button>
                    <div className="popup-content">
                        <img
                            src={selectedAuction.slika || ""} 
                            alt={selectedAuction.naziv}
                            className="popup-image"
                        />
                        <h3>{selectedAuction.naziv}</h3>
                        <p><strong>Starting Price:</strong> ${selectedAuction.pocetna_cijena}</p>
                        {selectedAuction.buy_now_cijena && (
                            <p><strong>Buy Now Price:</strong> ${selectedAuction.buy_now_cijena}</p>
                        )}
                        <p><strong>Info:</strong> {selectedAuction.informacije}</p>
                        <p><strong>Date:</strong> {new Date(selectedAuction.datum).toLocaleDateString()}</p>
                        <p><strong>Organizer:</strong> {selectedAuction.kreirao}</p>
                        {selectedAuction.najveca_ponuda && (
                            <p><strong>Highest Bid:</strong> ${selectedAuction.najveca_ponuda}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuctionsPage;
