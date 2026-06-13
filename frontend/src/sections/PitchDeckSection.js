import React from "react";

const PitchDeckSection = () => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/CRISIS-SOLVER-App.pdf";
    link.setAttribute("download", "Crisis_Solver_App.pdf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        📄 Our Pitch Deck
      </h2>

      <p
        style={{
          fontSize: "1.05rem",
          color: "#334155",
          marginBottom: "24px",
          lineHeight: "1.5",
        }}
      >
        Crisis Solver is an innovative global platform that combines
        rewards, donations, community engagement, and{" "}
        <strong>Hedera-powered transparency</strong>
        to address humanitarian challenges worldwide.
        By enabling users to earn through meaningful digital activities
        while simultaneously generating support for verified humanitarian
        projects, Crisis Solver transforms millions of small actions into
        large-scale social impact.

        <br />
        <br />

        🚀 <strong>Earn HBAR tokens</strong> • 🎮 Play impact games • 📹 Verify crisis media • 🤝 Donate transparently • 🌍 Support millions in need.
      </p>

      <button
        onClick={handleDownload}
        style={{
          padding: "12px 32px",
          backgroundColor: "#1e3a8a",
          color: "#fff",
          border: "none",
          borderRadius: "40px",
          fontWeight: "bold",
          fontSize: "1rem",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "#2563eb")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "#1e3a8a")
        }
      >
        📥 Download Our Pitch Deck (PDF)
      </button>

      <p
        style={{
          marginTop: "24px",
          fontSize: "0.8rem",
          color: "#64748b",
        }}
      >
        The PDF is also available upon request. Contact us at{" "}
        <strong>miskera22@gmail.com</strong>
      </p>

      <p
        style={{
          marginTop: "16px",
          fontWeight: "bold",
          color: "#1e3a8a",
          fontSize: "0.95rem",
        }}
      >
        Earn • Support • Heal the World
      </p>
    </section>
  );
};

export default PitchDeckSection;