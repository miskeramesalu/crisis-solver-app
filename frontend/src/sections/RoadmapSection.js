import React from "react";

const RoadmapSection = () => {
  return (
    <section
      style={{
        padding: "30px",
        margin: "20px auto",
        maxWidth: "1200px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9f9fc",
        borderRadius: "16px",
        border: "1px solid #e0e0e0",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#1a1a2e",
          borderBottom: "3px solid #0f0e6d",
          paddingBottom: "10px",
          display: "inline-block",
          width: "100%",
        }}
      >
        🧭 Crisis Solver – Roadmap to Transparent Impact
      </h2>
      <p style={{ textAlign: "center", color: "#555", marginBottom: "30px" }}>
        Built on Hedera Hashgraph · Micro‑actions → Macro‑impact
      </p>

      {/* Phase 0: MVP (Current Status) */}
      <div
        style={{
          marginBottom: "30px",
          padding: "20px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          borderLeft: "6px solid #1e88e5",
        }}
      >
        <h3 style={{ color: "#0d47a1" }}>✅ Phase 0 – MVP (Current – Hedera Testnet)</h3>
        <ul style={{ lineHeight: "1.7" }}>
          <li><strong>Functional prototype</strong> live on Hedera Testnet.</li>
          <li>Core features built & tested:
            <ul>
              <li>Gamified Dashboard (impact stats, HBAR token balance, leaderboards)</li>
              <li>AI‑powered quizzes & educational content</li>
              <li>Impact Games (empathy‑building mini‑games)</li>
              <li>Transparent Donation Engine (token‑based, tracked via Hedera Consensus Service)</li>
              <li>Verified Media Hub (upload/view authenticated crisis videos/images)</li>
            </ul>
          </li>
          <li>Referral & reward system implemented.</li>
          <li><strong>Technology:</strong> Hedera Token Service (HTS) for rewards, HCS for immutable audit trail.</li>
          <li>📊 <strong>Status:</strong> Ready for pilot NGO onboarding.</li>
        </ul>
      </div>

      {/* Phase 1: Next 6 Months */}
      <div
        style={{
          marginBottom: "30px",
          padding: "20px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          borderLeft: "6px solid #2ecc71",
        }}
      >
        <h3 style={{ color: "#1b5e20" }}>🚀 Phase 1 – Next 6 Months (Pilot & AI Integration)</h3>
        <ul style={{ lineHeight: "1.7" }}>
          <li>🤖 <strong>AI content moderation integration</strong> (prevent misinformation, verify crisis media).</li>
          <li>🤝 Establish <strong>pilot partnerships</strong> with 3–5 NGOs (e.g., Red Cross chapters, UN agencies).</li>
          <li>🔒 Complete <strong>security audits</strong> and <strong>UI/UX refinement</strong> based on early tester feedback.</li>
          <li>🌍 Launch <strong>ambassador program</strong> on African campuses (leverage Hedera Africa Hackathon for PR).</li>
          <li>💰 Integrate <strong>optional service fee (≤2%)</strong> to cover transaction costs.</li>
          <li>📊 <strong>Success metric:</strong> 10,000 active testnet users, $50,000 in token donations (simulated).</li>
        </ul>
      </div>

      {/* Phase 2: Next 12 Months */}
      <div
        style={{
          marginBottom: "30px",
          padding: "20px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          borderLeft: "6px solid #f39c12",
        }}
      >
        <h3 style={{ color: "#e65100" }}>🌍 Phase 2 – Next 12 Months (Mainnet Launch & Mobile App)</h3>
        <ul style={{ lineHeight: "1.7" }}>
          <li>🔗 <strong>Launch on Hedera Mainnet</strong> – real HBAR token rewards and donations.</li>
          <li>📱 Publish <strong>React Native mobile app</strong> (iOS & Android) for seamless access.</li>
          <li>🎮 Expand <strong>Impact Games library</strong> sponsored by ethical brands (sponsored campaigns revenue model).</li>
          <li>📢 Global marketing blitz – TikTok, Instagram, Twitter storytelling with user impact cases.</li>
          <li>🏦 Enable <strong>cash‑out options</strong> (HBAR → fiat via trusted on‑ramps) and direct token donations.</li>
          <li>📊 <strong>Success metric:</strong> 500,000 users, $1M distributed to verified crisis causes.</li>
        </ul>
      </div>

      {/* Phase 3: Future (12+ months) */}
      <div
        style={{
          marginBottom: "30px",
          padding: "20px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          borderLeft: "6px solid #8e24aa",
        }}
      >
        <h3 style={{ color: "#4a148c" }}>🔮 Phase 3 – Future (Decentralized Identity & Global Scale)</h3>
        <ul style={{ lineHeight: "1.7" }}>
          <li>🆔 Integrate <strong>Decentralized Identity (DID)</strong> for secure, privacy‑preserving user verification.</li>
          <li>🌐 <strong>Multilingual support</strong> + expansion to 30+ countries (Asia, Latin America, Europe).</li>
          <li>🏆 Launch <strong>NFT impact badges</strong> (Hedera native) for top contributors and donors.</li>
          <li>📡 <strong>Public transparency dashboard</strong> with real‑time Hedera Consensus Service audit trail.</li>
          <li>🤝 Strategic partnerships with major NGOs (WFP, UNICEF, WHO) for large‑scale deployment.</li>
          <li>📊 <strong>Success metric:</strong> 10M+ users, $50M+ total humanitarian aid tracked on‑ledger.</li>
        </ul>
      </div>

      {/* Key Milestones Table */}
      <div style={{ marginTop: "40px", overflowX: "auto" }}>
        <h3 style={{ textAlign: "center", color: "#1a1a2e" }}>📅 Key Milestones & Deliverables</h3>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: "#fff",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <thead style={{ backgroundColor: "#0f0e6d", color: "white" }}>
            <tr>
              <th style={{ padding: "12px", textAlign: "left" }}>Timeline</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Milestone</th>
              <th style={{ padding: "12px", textAlign: "left" }}>Status / Target</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "10px" }}>Q2 2025</td>
              <td style={{ padding: "10px" }}>AI content moderation live + first NGO pilot</td>
              <td style={{ padding: "10px", color: "#e67e22" }}>🔜 Planned</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #ddd", backgroundColor: "#f9f9f9" }}>
              <td style={{ padding: "10px" }}>Q3 2025</td>
              <td style={{ padding: "10px" }}>Security audit completed + Hedera Testnet → Mainnet preparation</td>
              <td style={{ padding: "10px", color: "#e67e22" }}>🔜 Planned</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "10px" }}>Q4 2025</td>
              <td style={{ padding: "10px" }}>Hedera Mainnet launch + React Native mobile app beta</td>
              <td style={{ padding: "10px", color: "#e67e22" }}>🔜 Planned</td>
            </tr>
            <tr style={{ borderBottom: "1px solid #ddd", backgroundColor: "#f9f9f9" }}>
              <td style={{ padding: "10px" }}>Q2 2026</td>
              <td style={{ padding: "10px" }}>500,000 users & $1M in token donations</td>
              <td style={{ padding: "10px", color: "#e67e22" }}>🔜 Planned</td>
            </tr>
            <tr>
              <td style={{ padding: "10px" }}>2027+</td>
              <td style={{ padding: "10px" }}>Decentralized Identity + global expansion (30+ countries)</td>
              <td style={{ padding: "10px", color: "#27ae60" }}>🌟 Vision</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Ethical & Hedera Alignment */}
      <div
        style={{
          marginTop: "40px",
          padding: "20px",
          backgroundColor: "#e8eaf6",
          borderRadius: "12px",
          textAlign: "center",
        }}
      >
        <h4 style={{ color: "#1a237e" }}>⚡ Powered by Hedera Hashgraph</h4>
        <p style={{ color: "#333" }}>
          Low‑cost · Carbon‑negative · Public audit trail via <strong>Hedera Consensus Service</strong><br />
          Every action, reward, and donation is immutable and transparent.
        </p>
        <p style={{ fontSize: "14px", marginTop: "10px" }}>
          📍 Aligned with UN SDGs (1, 2, 3, 4, 10, 17) — <em>Earn · Support · Heal the World</em>
        </p>
      </div>
    </section>
  );
};

export default RoadmapSection;