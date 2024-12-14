import React, { useState, useEffect } from "react";
import AuctionCreateForm from "./AuctionCreateForm";
import './AuctionsPage.css';

const AuctionsPage = () => {
    const [showForm, setShowForm] = useState(false);

    const handleToggleForm = () => {
        setShowForm(!showForm);
    };

    // Placeholder data for auction listings
    const placeholderAuctions = [
        {
            id: 1,
            naziv: "Vintage Watch",
            pocetna_cijena: 100,
            buy_now_cijena: 300,
            informacije: "A rare vintage watch in excellent condition.",
            datum: "2024-12-20",
        },
        {
            id: 2,
            naziv: "Painting by Local Artist",
            pocetna_cijena: 50,
            buy_now_cijena: 150,
            informacije: "Beautiful landscape painting by a talented local artist.",
            datum: "2024-12-22",
        },
        {
            id: 3,
            naziv: "Antique Vase",
            pocetna_cijena: 200,
            buy_now_cijena: 500,
            informacije: "A collectible antique vase from the 19th century.",
            datum: "2024-12-25",
        },
    ];

    return (
        <div className="auctions-page">
            <h1>Auctions</h1>
            <button className="create-auction-btn" onClick={handleToggleForm}>
                {showForm ? "Close Form" : "Create Auction"}
            </button>
            {showForm && <AuctionCreateForm />}

            <h2>Current Auctions</h2>
            <div className="auction-list">
                {placeholderAuctions.map((auction) => (
                    <div key={auction.id} className="auction-item">
                        <h3>{auction.naziv}</h3>
                        <p><strong>Starting Price:</strong> ${auction.pocetna_cijena}</p>
                        <p><strong>Buy Now Price:</strong> ${auction.buy_now_cijena}</p>
                        <p><strong>Info:</strong> {auction.informacije}</p>
                        <p><strong>Date:</strong> {auction.datum}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AuctionsPage;
