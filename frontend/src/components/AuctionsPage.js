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

    const handleToggleForm = () => {
        setShowForm(!showForm);
    };

    // Dummy auction data
    const dummyAuctions = [
        {
            id_aukcije: 1,
            naziv: "Vintage Watch",
            pocetna_cijena: 50,
            buy_now_cijena: 150,
            informacije: "A rare vintage wristwatch from the 1950s.",
            datum: "2024-12-20",
            slika: "https://via.placeholder.com/150/4CAF50/FFFFFF?text=Watch",
        },
        {
            id_aukcije: 2,
            naziv: "Antique Vase",
            pocetna_cijena: 100,
            buy_now_cijena: 300,
            informacije: "A beautifully crafted antique porcelain vase.",
            datum: "2024-12-18",
            slika: "https://via.placeholder.com/150/FFC107/FFFFFF?text=Vase",
        },
        {
            id_aukcije: 3,
            naziv: "Luxury Handbag",
            pocetna_cijena: 200,
            buy_now_cijena: 600,
            informacije: "A designer handbag in excellent condition.",
            datum: "2024-12-25",
            slika: "https://via.placeholder.com/150/E91E63/FFFFFF?text=Handbag",
        },
        {
            id_aukcije: 4,
            naziv: "Mountain Bike",
            pocetna_cijena: 150,
            buy_now_cijena: 500,
            informacije: "A high-quality mountain bike, barely used.",
            datum: "2024-12-30",
            slika: "https://via.placeholder.com/150/2196F3/FFFFFF?text=Bike",
        },
        {
            id_aukcije: 5,
            naziv: "Guitar",
            pocetna_cijena: 120,
            buy_now_cijena: 400,
            informacije: "A vintage acoustic guitar in great condition.",
            datum: "2024-12-28",
            slika: "https://via.placeholder.com/150/9C27B0/FFFFFF?text=Guitar",
        },
        {
            id_aukcije: 6,
            naziv: "Smartphone",
            pocetna_cijena: 300,
            buy_now_cijena: 800,
            informacije: "Latest model with top-notch features.",
            datum: "2024-12-26",
            slika: "https://via.placeholder.com/150/00BCD4/FFFFFF?text=Phone",
        },
        {
            id_aukcije: 7,
            naziv: "Painting",
            pocetna_cijena: 500,
            buy_now_cijena: 1500,
            informacije: "An original oil painting by a famous artist.",
            datum: "2024-12-29",
            slika: "https://via.placeholder.com/150/4CAF50/FFFFFF?text=Painting",
        },
        {
            id_aukcije: 8,
            naziv: "Laptop",
            pocetna_cijena: 400,
            buy_now_cijena: 1000,
            informacije: "A powerful laptop, perfect for gaming and work.",
            datum: "2024-12-23",
            slika: "https://via.placeholder.com/150/FFC107/FFFFFF?text=Laptop",
        },
        {
            id_aukcije: 9,
            naziv: "Camera",
            pocetna_cijena: 250,
            buy_now_cijena: 750,
            informacije: "A professional DSLR camera with accessories.",
            datum: "2024-12-27",
            slika: "https://via.placeholder.com/150/E91E63/FFFFFF?text=Camera",
        },
        {
            id_aukcije: 10,
            naziv: "Gaming Console",
            pocetna_cijena: 200,
            buy_now_cijena: 600,
            informacije: "A next-gen gaming console with two controllers.",
            datum: "2024-12-24",
            slika: "https://via.placeholder.com/150/2196F3/FFFFFF?text=Console",
        },
        {
            id_aukcije: 11,
            naziv: "Jewelry Set",
            pocetna_cijena: 700,
            buy_now_cijena: 2000,
            informacije: "An exquisite gold and diamond jewelry set.",
            datum: "2024-12-22",
            slika: "https://via.placeholder.com/150/9C27B0/FFFFFF?text=Jewelry",
        },
        {
            id_aukcije: 12,
            naziv: "Drone",
            pocetna_cijena: 350,
            buy_now_cijena: 900,
            informacije: "A high-performance drone with 4K camera.",
            datum: "2024-12-21",
            slika: "https://via.placeholder.com/150/00BCD4/FFFFFF?text=Drone",
        },
    ];

    useEffect(() => {
        setAuctions(dummyAuctions); // Set dummy data until the backend is fixed
    }, []);

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
            <div className="auction-list">
                {auctions.map((auction) => (
                    <div key={auction.id_aukcije} className="auction-item">
                        <h3>{auction.naziv}</h3>
                        <p><strong>Starting Price:</strong> ${auction.pocetna_cijena}</p>
                        {auction.buy_now_cijena && (
                            <p><strong>Buy Now Price:</strong> ${auction.buy_now_cijena}</p>
                        )}
                        <p><strong>Info:</strong> {auction.informacije}</p>
                        <p><strong>Date:</strong> {new Date(auction.datum).toLocaleDateString()}</p>
                        <img src={auction.slika} alt={auction.naziv} className="auction-image" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AuctionsPage;
