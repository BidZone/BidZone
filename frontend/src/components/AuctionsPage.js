import React, { useState, useEffect } from "react";
import AuctionCreateForm from "./AuctionCreateForm";
import './AuctionsPage.css';
import { useAuth } from "../contexts/AuthContext"; // Import AuthContext hook

const apiUrl = process.env.REACT_APP_API_BASE_URL; // API baza URL-a

const AuctionsPage = () => {
    const { isAuthenticated } = useAuth(); // Provjera autentifikacije
    const [auctions, setAuctions] = useState([]); // Stanje za aukcije
    const [loading, setLoading] = useState(true); // Stanje za prikaz loading indikatora
    const [error, setError] = useState(null); // Stanje za prikaz grešaka
    const [showForm, setShowForm] = useState(false);

    const handleToggleForm = () => {
        setShowForm(!showForm);
    };

    // Dohvati aukcije iz API-ja
    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/users/auctions/`);
                if (!response.ok) {
                    throw new Error("Failed to fetch auctions");
                }
                const data = await response.json();
                setAuctions(data); // Postavi aukcije u stanje
            } catch (err) {
                setError(err.message); // Postavi grešku
            } finally {
                setLoading(false); // Isključi loading
            }
        };

        fetchAuctions();
    }, []); // Prazan array znači da se efekt pokreće samo jednom nakon mount-a

    if (loading) {
        return <div className="loading">Loading auctions...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="auctions-page">
            <h1>Auctions</h1>

            {/* Prikaz gumba za formu samo ako je korisnik prijavljen */}
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
                        {auction.slika && <img src={auction.slika} alt={auction.naziv} className="auction-image" />}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AuctionsPage;
