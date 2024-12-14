import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext"; // Import AuthContext

const apiUrl = process.env.REACT_APP_API_BASE_URL;

const Login = () => {
  const [credentials, setCredentials] = useState({ identifier: "", password: "" });
  const { login } = useAuth(); // Access login function from AuthContext

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Replace with your API call
      const response = await fetch(`${apiUrl}/api/users/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials), // Sending { identifier, password }
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token; // Assume the API sends back a token
        login(token); // Call login function to save token and update state
      } else {
        const errorData = await response.json(); // Parse error response
        console.error("Login failed:", errorData);
        alert(
          errorData.identifier ||
            errorData.password ||
            "Invalid credentials. Please try again."
        );
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div>
          <label>Username or Email</label>
          <input
            type="text"
            name="identifier" // Match backend field name
            value={credentials.identifier}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
