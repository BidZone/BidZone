import React, { useState } from "react";
import './Register.css';

const apiUrl = process.env.REACT_APP_API_BASE_URL;

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    id: "",
    homeAddress: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Validate form data
  const validate = () => {
    const newErrors = {};

    // Email validation (must have valid domain)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Username validation (5-6 symbols)
    if (formData.username.length < 5 || formData.username.length > 6) {
      newErrors.username = "Username must be between 5 and 6 characters.";
    }

    // Password validation (min 8 symbols, at least one letter and one number)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters long, including at least one letter and one number.";
    }

    // Confirm Password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    // First and Last Name validation (no numerical values allowed)
    const nameRegex = /^[A-Za-z]+$/;
    if (!nameRegex.test(formData.firstName)) {
      newErrors.firstName = "First name cannot contain numbers or special characters.";
    }
    if (!nameRegex.test(formData.lastName)) {
      newErrors.lastName = "Last name cannot contain numbers or special characters.";
    }

    // ID validation (exactly 11 digits)
    if (!/^\d{11}$/.test(formData.id)) {
      newErrors.id = "ID must consist of exactly 11 digits.";
    }

    // Home Address validation (required)
    if (!formData.homeAddress) {
      newErrors.homeAddress = "Home address is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
        const response = await fetch(`${apiUrl}/api/users/register/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ime: formData.firstName,
            prezime: formData.lastName,
            oib: formData.id,
            adresa: formData.homeAddress,
            korisnicko_ime: formData.username,
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setMessage(data.message);
          setErrors({});
          setFormData({
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
            firstName: "",
            lastName: "",
            id: "",
            homeAddress: "",
          });
        } else {
          setErrors(data); // API validation errors
          setMessage("");
        }
      } catch (error) {
        console.error("Error during registration:", error);
        setMessage("An error occurred. Please try again later.");
      }
    } else {
      alert("Please fix the errors in the form.");
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      {message && <p className="success-message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-column">
            <div>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <p className="error">{errors.email}</p>}
            </div>
            <div>
              <label>Username:</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              {errors.username && <p className="error">{errors.username}</p>}
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {errors.password && <p className="error">{errors.password}</p>}
            </div>
            <div>
              <label>Confirm Password:</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              {errors.confirmPassword && (
                <p className="error">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
          <div className="form-column">
            <div>
              <label>First Name:</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              {errors.firstName && <p className="error">{errors.firstName}</p>}
            </div>
            <div>
              <label>Last Name:</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              {errors.lastName && <p className="error">{errors.lastName}</p>}
            </div>
            <div>
              <label>ID (11 digits):</label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleChange}
                required
              />
              {errors.id && <p className="error">{errors.id}</p>}
            </div>
            <div>
              <label>Home Address:</label>
              <input
                type="text"
                name="homeAddress"
                value={formData.homeAddress}
                onChange={handleChange}
                required
              />
              {errors.homeAddress && (
                <p className="error">{errors.homeAddress}</p>
              )}
            </div>
          </div>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;