import React, { useState, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const WaitlistSection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const recaptchaRef = useRef();

  // Get the site key from environment variables
  const siteKey = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!siteKey) {
      alert("reCAPTCHA is not configured. Please contact support.");
      return;
    }

    if (!captchaToken) {
      alert("Please complete the reCAPTCHA verification.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, captchaToken }),
      });
      const data = await response.json();
      if (response.ok) {
        setIsSubmitted(true);
        setEmail("");
        recaptchaRef.current.reset();
        setCaptchaToken(null);
      } else {
        alert(data.error || "Something went wrong.");
        recaptchaRef.current.reset();
        setCaptchaToken(null);
      }
    } catch (error) {
      console.error("Waitlist error:", error);
      alert("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const onCaptchaExpired = () => {
    setCaptchaToken(null);
  };

  return (
    <section
      style={{
        padding: "48px 24px",
        margin: "20px auto",
        maxWidth: "800px",
        textAlign: "center",
        backgroundColor: "#f0f9ff",
        borderRadius: "24px",
        border: "1px solid #cbd5e1",
        boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
      }}
    >
      <h2
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          color: "#1e3a8a",
          marginBottom: "16px",
        }}
      >
        🌍 Join the Waitlist
      </h2>
      <p
        style={{
          fontSize: "1.1rem",
          color: "#334155",
          marginBottom: "12px",
        }}
      >
        Be the first to experience <strong>Crisis Solver</strong> — where every micro-action helps solve real crises.
      </p>
      <p
        style={{
          fontSize: "0.95rem",
          color: "#475569",
          marginBottom: "24px",
        }}
      >
        🚀 Earn HBAR tokens • Donate transparently on Hedera • Support 307M+ people in need
      </p>

      {!isSubmitted ? (
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: "12px 16px",
              width: "280px",
              borderRadius: "40px",
              border: "1px solid #cbd5e1",
              fontSize: "1rem",
              outline: "none",
            }}
          />

          {siteKey ? (
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={siteKey}
              onChange={onCaptchaChange}
              onExpired={onCaptchaExpired}
            />
          ) : (
            <div
              style={{
                padding: "10px",
                backgroundColor: "#fee2e2",
                color: "#b91c1c",
                borderRadius: "8px",
                fontSize: "0.85rem",
              }}
            >
              ⚠️ reCAPTCHA is not configured. Please set REACT_APP_RECAPTCHA_SITE_KEY in your .env file and restart the app.
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !siteKey}
            style={{
              padding: "12px 28px",
              background: isLoading || !siteKey ? "#9ca3af" : "#1e3a8a",
              color: "#fff",
              border: "none",
              borderRadius: "40px",
              cursor: isLoading || !siteKey ? "not-allowed" : "pointer",
              fontWeight: "bold",
              fontSize: "1rem",
            }}
          >
            {isLoading ? "Signing up..." : "Notify Me"}
          </button>
        </form>
      ) : (
        <div
          style={{
            backgroundColor: "#d1fae5",
            padding: "16px",
            borderRadius: "16px",
            color: "#065f46",
          }}
        >
          ✅ Thank you! You're on the list. We'll notify you when we launch.
        </div>
      )}

      <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "24px" }}>
        No spam, only launch updates. We respect your privacy.
      </p>
      <p
        style={{
          marginTop: "16px",
          fontWeight: "bold",
          color: "#1e3a8a",
          fontSize: "0.9rem",
        }}
      >
        Earn • Support • Heal the World
      </p>
    </section>
  );
};

export default WaitlistSection;