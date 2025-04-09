import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // Use useNavigate instead of useHistory

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();  // Changed to useNavigate

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic client-side validation
    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    try {
      // Make login request to server
      const response = await axios.post("http://localhost:5000/login", {
        username,
        password,
      });

      if (response.data.success) {
        // Save user data to localStorage (or use context if needed)
        localStorage.setItem("user", JSON.stringify({ username }));
        navigate("/dashboard"); // Redirect to the dashboard or main page using navigate
      } else {
        setError(response.data.message || "Login failed. Try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <div>
        <p>Don't have an account? <a href="/register">Register here</a></p>
      </div>
    </div>
  );
};

export default LoginPage;
