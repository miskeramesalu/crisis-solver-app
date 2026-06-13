import React, { useState } from "react";

const PartnerSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call – replace with your actual backend endpoint
    try {
      // await fetch("/api/partnership-request", { method: "POST", body: JSON.stringify(formData) });
      console.log("Partnership request:", formData);
      setTimeout(() => {
        setSubmitted(true);
        setFormData({ name: "", email: "", organization: "", message: "" });
      }, 500);
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      style={{
        padding: "48px 24px",
        margin: "20px auto",
        maxWidth: "900px",
        textAlign: "center",
        backgroundColor: "#f8fafc",
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
        🤝 Partner With Us
      </h2>
      <p
        style={{
          fontSize: "1.1rem",
          color: "#334155",
          marginBottom: "12px",
        }}
      >
        Join a global movement that connects <strong>micro‑actions</strong> to <strong>macro‑impact</strong>.
      </p>
      <p
        style={{
          fontSize: "0.95rem",
          color: "#475569",
          marginBottom: "24px",
        }}
      >
        🌍 NGOs, UN agencies, ethical brands, tech companies, and campus ambassadors – 
        let's build the most transparent humanitarian platform together.
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "center",
          marginBottom: "32px",
        }}
      >
        <div style={{ flex: "1", minWidth: "180px", background: "#fff", padding: "16px", borderRadius: "16px", boxShadow: "0 2px 6px rgba(0,0,0,0.05)" }}>
          <span style={{ fontSize: "2rem" }}>🏢</span>
          <h4 style={{ margin: "8px 0 4px", color: "#1e3a8a" }}>NGOs & UN Agencies</h4>
          <p style={{ fontSize: "0.85rem", color: "#555" }}>Access a new donor base and transparent reporting</p>
        </div>
        <div style={{ flex: "1", minWidth: "180px", background: "#fff", padding: "16px", borderRadius: "16px", boxShadow: "0 2px 6px rgba(0,0,0,0.05)" }}>
          <span style={{ fontSize: "2rem" }}>💡</span>
          <h4 style={{ margin: "8px 0 4px", color: "#1e3a8a" }}>Ethical Brands</h4>
          <p style={{ fontSize: "0.85rem", color: "#555" }}>Sponsor quizzes, games, or media views for social good</p>
        </div>
        <div style={{ flex: "1", minWidth: "180px", background: "#fff", padding: "16px", borderRadius: "16px", boxShadow: "0 2px 6px rgba(0,0,0,0.05)" }}>
          <span style={{ fontSize: "2rem" }}>🔗</span>
          <h4 style={{ margin: "8px 0 4px", color: "#1e3a8a" }}>Tech & Blockchain</h4>
          <p style={{ fontSize: "0.85rem", color: "#555" }}>Leverage Hedera, AI, or cloud infrastructure with us</p>
        </div>
        <div style={{ flex: "1", minWidth: "180px", background: "#fff", padding: "16px", borderRadius: "16px", boxShadow: "0 2px 6px rgba(0,0,0,0.05)" }}>
          <span style={{ fontSize: "2rem" }}>🎓</span>
          <h4 style={{ margin: "8px 0 4px", color: "#1e3a8a" }}>Campus Ambassadors</h4>
          <p style={{ fontSize: "0.85rem", color: "#555" }}>Lead local chapters and spread the movement</p>
        </div>
      </div>

      {!submitted ? (
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            maxWidth: "500px",
            margin: "0 auto",
          }}
        >
          <input
            type="text"
            name="name"
            placeholder="Your Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{
              padding: "12px 16px",
              borderRadius: "40px",
              border: "1px solid #cbd5e1",
              fontSize: "1rem",
            }}
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              padding: "12px 16px",
              borderRadius: "40px",
              border: "1px solid #cbd5e1",
              fontSize: "1rem",
            }}
          />
          <input
            type="text"
            name="organization"
            placeholder="Organization / Company"
            value={formData.organization}
            onChange={handleChange}
            required
            style={{
              padding: "12px 16px",
              borderRadius: "40px",
              border: "1px solid #cbd5e1",
              fontSize: "1rem",
            }}
          />
          <textarea
            name="message"
            placeholder="Tell us how you'd like to partner..."
            rows="3"
            value={formData.message}
            onChange={handleChange}
            required
            style={{
              padding: "12px 16px",
              borderRadius: "24px",
              border: "1px solid #cbd5e1",
              fontSize: "1rem",
              resize: "vertical",
            }}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: "12px 28px",
              background: isSubmitting ? "#9ca3af" : "#17a2b8",
              color: "#fff",
              border: "none",
              borderRadius: "40px",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              fontWeight: "bold",
              fontSize: "1rem",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) e.currentTarget.style.background = "#138496";
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) e.currentTarget.style.background = "#17a2b8";
            }}
          >
            {isSubmitting ? "Sending..." : "Become a Partner"}
          </button>
        </form>
      ) : (
        <div
          style={{
            backgroundColor: "#d1fae5",
            padding: "20px",
            borderRadius: "16px",
            color: "#065f46",
            maxWidth: "500px",
            margin: "0 auto",
          }}
        >
          ✅ Thank you for your interest! We'll be in touch within 2 business days.
        </div>
      )}

      <p
        style={{
          marginTop: "32px",
          fontSize: "0.75rem",
          color: "#64748b",
        }}
      >
        Together, we advance SDGs 1, 2, 3, 4, 10, 17 — with transparency and impact.
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

export default PartnerSection;