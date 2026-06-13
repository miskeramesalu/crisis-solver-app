import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL =
    process.env.REACT_APP_API_URL || "http://localhost:4000/api";

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/auth/forgot-password`,
        { email }
      );

      setSuccess(
        response.data.message ||
          "Password reset link has been sent to your email."
      );

      setEmail("");
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.message ||
          "Failed to send reset email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center text-white bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('/Crisis7778.png')",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900/80 backdrop-blur-sm p-10 rounded-2xl w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">
          Forgot Password
        </h1>

        <p className="text-gray-300 text-sm mb-4 text-center">
          Enter your registered email address and we'll send you a password
          reset link.
        </p>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/20 border border-green-500 text-green-300 p-3 rounded mb-4">
            {success}
          </div>
        )}

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-3 mb-4 rounded-lg text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 p-3 rounded-lg disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <div className="mt-4 text-center">
          <Link
            to="/login"
            className="text-green-400 hover:text-green-300"
          >
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;