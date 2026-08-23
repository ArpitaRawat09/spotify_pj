import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || "http://localhost:3000";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(
        `${AUTH_API_URL}/api/auth/login`,
        {
          email: formData.email,
          password: formData.password,
        },
        {
          withCredentials: true,
        }
      );
      console.log("Logged in successfully:", response.data);
      navigate("/");
    } catch (err) {
      console.error("Error logging in user:", err);
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page auth-page">
      <div className="auth-copy">
        <span className="eyebrow">Welcome back</span>
        <h1>Login</h1>
        <p>Sign in with your email and password to continue.</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        {error && (
          <div
            className="form-error"
            style={{ color: "red", marginBottom: "10px" }}
          >
            {error}
          </div>
        )}

        <label className="field">
          <span>Email</span>
          <input
            type="email"
            name="email"
            placeholder="john@example.com"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label className="field">
          <span>Password</span>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="auth-divider">or</div>

        <button onClick={() => {
            window.location.href = `${AUTH_API_URL}/api/auth/google`;
        }} type="button" className="google-button">
          <span className="google-icon" aria-hidden="true">
            G
          </span>
          Continue with Google
        </button>
      </form>
    </section>
  );
}