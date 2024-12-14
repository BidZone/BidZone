import React, { useState } from "react";
import './AuctionCreateForm.css';

const apiUrl = process.env.REACT_APP_API_BASE_URL; // Baza URL-a za API

const AuctionCreateForm = () => {
    const [formData, setFormData] = useState({
        naziv: "",
        pocetna_cijena: "",
        buy_now_cijena: "",
        trajanje: "",
        informacije: "",
        datum: "",
        slika: null
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            slika: e.target.files[0]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // FormData objekt za slanje multipart/form-data
        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }

        try {
            const response = await fetch(`${apiUrl}/api/users/auctions/create/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}` // Token iz localStorage
                },
                body: data,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Failed to create auction.");
            }

            const result = await response.json();
            setSuccess("Auction created successfully!");
            setFormData({
                naziv: "",
                pocetna_cijena: "",
                buy_now_cijena: "",
                trajanje: "",
                informacije: "",
                datum: "",
                slika: null
            });
        } catch (err) {
            setError(err.message || "An error occurred. Please try again.");
        }
    };

    return (
        <div className="form-container">
            <h2>Create Auction</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="naziv">Auction Name</label>
                    <input
                        type="text"
                        id="naziv"
                        name="naziv"
                        value={formData.naziv}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="pocetna_cijena">Starting Price</label>
                    <input
                        type="number"
                        id="pocetna_cijena"
                        name="pocetna_cijena"
                        value={formData.pocetna_cijena}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="buy_now_cijena">Buy Now Price</label>
                    <input
                        type="number"
                        id="buy_now_cijena"
                        name="buy_now_cijena"
                        value={formData.buy_now_cijena}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="trajanje">Duration (in hours)</label>
                    <input
                        type="number"
                        id="trajanje"
                        name="trajanje"
                        value={formData.trajanje}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="informacije">Information</label>
                    <textarea
                        id="informacije"
                        name="informacije"
                        value={formData.informacije}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="datum">Date</label>
                    <input
                        type="date"
                        id="datum"
                        name="datum"
                        value={formData.datum}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="slika">Image</label>
                    <input
                        type="file"
                        id="slika"
                        name="slika"
                        onChange={handleFileChange}
                    />
                </div>
                <button type="submit">Create Auction</button>
            </form>

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
        </div>
    );
};

export default AuctionCreateForm;
