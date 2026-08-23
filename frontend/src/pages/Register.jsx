import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || "http://localhost:3000";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    userType: "user",
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
        `${AUTH_API_URL}/api/auth/register`,
        {
          fullName: {
            firstName: formData.firstName,
            lastName: formData.lastName,
          },
          email: formData.email,
          password: formData.password,
          userType: formData.userType,
        },
        {
          withCredentials: true, // Include credentials in the request
        },
      );

      console.log("Registered successfully:", response.data);
      navigate("/");
    } catch (err) {
      console.error("Error registering user:", err);
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page auth-page">
      <div className="auth-copy">
        <span className="eyebrow">Create account</span>
        <h1 className="heading">Register</h1>
        <p>
          Create a new account with your email address and basic profile
          details.
        </p>
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

        <div className="field-grid">
          <label className="field">
            <span>First name</span>
            <input
              type="text"
              name="firstName"
              placeholder="John"
              autoComplete="given-name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </label>

          <label className="field">
            <span>Last name</span>
            <input
              type="text"
              name="lastName"
              placeholder="Doe"
              autoComplete="family-name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </label>
        </div>

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
            placeholder="Create a password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>

        <div className="field">
          <span>User type</span>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name="userType"
                value="user"
                checked={formData.userType === "user"}
                onChange={handleChange}
              />
              <span>User</span>
            </label>

            <label className="radio-option">
              <input
                type="radio"
                name="userType"
                value="artist"
                checked={formData.userType === "artist"}
                onChange={handleChange}
              />
              <span>Artist</span>
            </label>
          </div>
        </div>

        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>

        <div className="auth-divider">or</div>

        <button
          onClick={() => {
            window.location.href = `${AUTH_API_URL}/api/auth/google`;
          }}
          type="button"
          className="google-button"
        >
          <span className="google-icon" aria-hidden="true">
            G
          </span>
          Continue with Google
        </button>
      </form>
    </section>
  );
}
