// frontend/src/components/DashboardTab.js
import React, { useEffect, useState } from "react";
import { fetchLeaderboard, fetchUserBalance } from "../api";
import { useAuth } from "../context/AuthContext";

const DashboardTab = () => {
  const { user } = useAuth();                       // logged‑in user
  const [leaderboard, setLeaderboard] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  const [error, setError] = useState("");

  // Fetch leaderboard only
  const loadLeaderboard = async () => {
    setLoadingLeaderboard(true);
    try {
      const lb = await fetchLeaderboard();
      setLeaderboard(lb || []);
      setError("");
    } catch (err) {
      console.error("Leaderboard fetch failed:", err);
      setError("Failed to load leaderboard");
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  // Fetch balance for the logged‑in user
  const refreshBalance = async () => {
    if (!user) {
      setError("Please log in to see your balance");
      return;
    }
    setLoadingBalance(true);
    setError("");
    try {
      // user.id comes from the JWT payload (MongoDB _id)
      const b = await fetchUserBalance(user.id);
      setBalance(typeof b === "number" ? b : 0);
    } catch (err) {
      console.error("Balance fetch failed:", err);
      setError("Failed to fetch balance. Make sure you are logged in.");
      setBalance(0);
    } finally {
      setLoadingBalance(false);
    }
  };

  // Load leaderboard on mount and refresh it every 8 seconds
  useEffect(() => {
    loadLeaderboard();
    const interval = setInterval(loadLeaderboard, 8000);
    return () => clearInterval(interval);
  }, []);

  // Fetch balance whenever the user changes (login/logout)
  useEffect(() => {
    if (user) {
      refreshBalance();
    } else {
      setBalance(0);
    }
  }, [user]);

  // If no user is logged in, show a login prompt
  if (!user) {
    return (
      <div className="p-4 text-center">
        <h2 className="p-6 rounded-lg bg-[brown] text-white">Dashboard</h2>
        <p className="mt-4 text-red-600">Please log in to view your balance and dashboard.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="p-6 rounded-lg bg-[brown] text-white">Dashboard</h2>

      <div className="mt-4">
        <p className="text-gray-700 mb-2">Logged in as: <strong>{user.username}</strong> (ID: {user.id})</p>
        <button
          onClick={refreshBalance}
          disabled={loadingBalance}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loadingBalance ? "Refreshing..." : "🔄 Refresh Balance"}
        </button>
      </div>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      <div className="mt-4">
        <p className="text-lg font-semibold text-green-700">
          Balance: {loadingBalance ? "..." : balance} Tokens
        </p>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold text-xl">Leaderboard (Top 5)</h3>
        {loadingLeaderboard && <p>Loading leaderboard...</p>}
        {!loadingLeaderboard && leaderboard.length === 0 && (
          <p className="text-gray-500">No leaderboard data yet. Play a quiz or game to earn points!</p>
        )}
        {leaderboard.slice(0, 5).map((userEntry, idx) => (
          <div key={idx} className="border p-2 my-1 rounded bg-gray-50">
            #{idx + 1} – {userEntry.userId}: {userEntry.score} pts
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardTab;