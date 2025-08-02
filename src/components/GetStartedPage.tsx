import React from "react";
import { useNavigate } from "react-router-dom";

const WhatIsVysixPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-12">
      {/* Headline */}
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4">
        What is Vysix?
      </h1>

      {/* Description */}
      <p className="text-gray-300 text-center max-w-xl mb-6">
        Vysix uses AI to instantly generate inspection forms and professional bids for service-based work — from side hustles to serious trades. 
      </p>

      {/* Call to Action */}
      <button
        onClick={() => navigate("/choose-hustle")}
        className="bg-purple-600 hover:bg-purple-700 transition text-white font-semibold py-2 px-6 rounded-lg shadow"
      >
        Continue
      </button>
    </div>
  );
};

export default WhatIsVysixPage;
