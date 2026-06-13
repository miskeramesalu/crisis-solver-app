import React from "react";

const AboutSection = () => {
  return (
    <section className="py-12 px-6 max-w-5xl mx-auto">
      
      <h2 className="text-3xl font-bold mb-6">About Us</h2>

      <p className="mb-4 text-lg">
        <strong>Crisis Solver</strong> is a global digital humanitarian platform
        designed to connect people in crisis with supporters, donors, and
        organizations through technology, media, and engagement.
      </p>

      <p className="mb-4">
        Millions of people around the world face challenges such as hunger,
        health emergencies, and displacement. At the same time, traditional
        donation systems often lack transparency and direct engagement from
        everyday users.
      </p>

      <p className="mb-4">
        Crisis Solver solves this gap by allowing users to <strong>earn rewards
        while helping others</strong> through activities such as watching or
        uploading crisis videos, answering questions, playing impact-driven
        games, and participating in surveys.
      </p>

      <p className="mb-4">
        The platform combines <strong>micro-donations, gamification, and
        transparency</strong> so that every interaction contributes to real
        humanitarian impact.
      </p>

      <p className="font-semibold mt-6">
        “Every action you take helps solve a crisis.”
      </p>
    </section>
  );
};

export default AboutSection;