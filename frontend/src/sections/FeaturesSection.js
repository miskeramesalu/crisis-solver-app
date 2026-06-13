import React from "react";

const FeaturesSection = () => {
  const features = [
    "Crisis Content Upload & Awareness Sharing",
    "Reward-Based Video and Image Engagement",
    "Humanitarian Surveys and Knowledge Challenges",
    "Crisis-Solving Games and Community Participation",
    "Secure Global Donation System",
    "Multi-Currency Exchange Integration",
    "User Earnings, Rewards, and Gifting",
    "Referral and Social Sharing Incentives",
    "AI-Powered Verification and Fraud Prevention",
    "Transparent Impact Tracking and Reporting",
  ];

  return (
    <section className="py-12 px-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">
        Key Features
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg shadow-sm"
          >
            ✓ {feature}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;