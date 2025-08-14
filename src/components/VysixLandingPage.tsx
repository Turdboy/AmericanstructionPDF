import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; // Adjust path if needed

const VysixLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // 👈 check if user is logged in

  const handleGetStarted = () => {
    if (user) {
      navigate("/vysix/dashboard"); // ✅ Go straight to dashboard
    } else {
      navigate("/login", { state: { from: "vysix" } }); // 👈 prompt login
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-bold text-purple-400 mb-4">Welcome to Vysix</h1>
      <p className="text-lg text-center max-w-xl mb-8">
        Vysix is your personal dashboard for tracking, reviewing, and rating TV shows — from Marvel, DC, and beyond.
        Powered by AI, designed for superfans.
      </p>
      <img
        src="/vysix-logo.png"
        alt="Vysix Logo"
        className="w-32 h-32 mb-6"
      />
      <button
        onClick={handleGetStarted}
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded text-lg transition"
      >
        Get Started
      </button>
    </div>
  );
};

export default VysixLandingPage;
