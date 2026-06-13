import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

// Components
import Navbar from "../components/Navbar";
import DashboardTab from "../components/DashboardTab";
import QuizTab from "../components/QuizTab";
import GameTab from "../components/GameTab";
import DonationTab from "../components/DonationTab";
import ReferralTab from "../components/ReferralTab";
import MediaTab from "../components/MediaTab";
import LeaderboardTab from "../components/LeaderboardTab";
import WalletCard from "../components/WalletCard";
import WithdrawForm from "../components/WithdrawForm";

const DashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Render active tab
  const renderTab = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <>
            <DashboardTab />

            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <WalletCard />
              <WithdrawForm />
            </div>

            <div className="mt-4">
              <Link
                to="/withdraw-history"
                className="text-blue-600 hover:underline"
              >
                View withdrawal history
              </Link>
            </div>
          </>
        );

      case "quiz":
        return <QuizTab />;

      case "game":
        return <GameTab />;

      case "donation":
        return <DonationTab />;

      case "referral":
        return <ReferralTab />;

      case "media":
        return <MediaTab />;

      case "leaderboard":
        return <LeaderboardTab />;

      default:
        return <DashboardTab />;
    }
  };

  return (
    <div className="min-h-screen bg-green-500">

      {/* Header */}
      <div className="bg-white p-4 shadow">
        <h1 className="text-3xl font-bold">
          Dashboard, {user?.name || "User"}
        </h1>
      </div>

      {/* Navbar (ONLY here) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content */}
      <main className="p-6">
        {renderTab()}
      </main>

    </div>
  );
};

export default DashboardPage;