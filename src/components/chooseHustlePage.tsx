import React from "react";
import { useNavigate } from "react-router-dom";

const hustles = [
  { name: "Power Washing", icon: "💦" },
  { name: "Lawncare", icon: "🌱" },
  { name: "Painting", icon: "🎨" },
  { name: "Gutter Cleaning", icon: "🧹" },
  { name: "Commercial Roofing", icon: "🏢" },
  { name: "Residential Roofing", icon: "🏠" },
  { name: "Custom Hustle", icon: "🛠️" },
];

const ChooseHustlePage = () => {
  const navigate = useNavigate();

  const handleSelect = (hustleName: string) => {
navigate("/design", { state: { field: hustleName } });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center px-6 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">Pick Your Field</h1>
      <p className="text-gray-400 text-center mb-8 max-w-md">
        Choose the type of job you want to start. We’ll help you build a professional inspection form and proposal tailored to that hustle.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
        {hustles.map((hustle, index) => (
          <button
            key={index}
            onClick={() => handleSelect(hustle.name)}
            className="bg-gray-800 hover:bg-purple-600 transition flex items-center justify-between px-4 py-3 rounded-lg shadow border border-gray-700"
          >
            <span className="text-lg font-semibold">{hustle.icon} {hustle.name}</span>
            <span className="text-sm text-gray-400">Start</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChooseHustlePage;
