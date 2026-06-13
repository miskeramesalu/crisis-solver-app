import React from "react";
import { Link } from "react-router-dom";

const HomeSection = () => {
  return (
    <section
      className="min-h-screen flex flex-col justify-center items-center text-white text-center px-6 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('/Crisis7778.png')",
      }}
    >
      {/* Logo / Title */}
      <h1 className="text-6xl font-bold text-green-400 mb-6">
        CRISIS SOLVER
      </h1>

      {/* Tagline */}
      <p className="text-2xl mb-4 max-w-3xl text-blue-500">
        Earn • Support • Heal the World
      </p>

      {/* Description */}
      <p className="text-gray-200 max-w-2xl mb-10">
        A global humanitarian platform empowering people to
        fight hunger, health crises, and displacement through
        digital engagement, donations, games, media, and
        AI-powered solutions.
      </p>

      {/* Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Link
          to="/register"
          className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl font-semibold"
        >
          Get Started
        </Link>

        <Link
          to="/login"
          className="bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-xl font-semibold"
        >
          Login
        </Link>

        <Link
          to="/dashboard"
          className="border border-green-400 hover:bg-green-500 hover:text-white px-6 py-3 rounded-xl text-blue-500 font-semibold"
        >
          Enter App
        </Link>
      </div>
    </section>
  );
};

export default HomeSection;