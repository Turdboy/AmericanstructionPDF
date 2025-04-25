import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

const InspectionTypePage = () => {
  const navigate = useNavigate();

  const handleSelect = (type: string) => {
    // If commercial is selected, check login
    if (type === "commercial") {
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in to start a Commercial Roofing inspection.");
        return navigate("/login");
      }
      return navigate("/inspection/commercial"); // ✅ updated path
    }
    

    // Add logic for other types here later
    if (type === "residential") {
      return alert("Residential form coming soon!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Select Inspection Type</h1>

      <div className="space-y-4">
        <button
          onClick={() => handleSelect("commercial")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded text-lg"
        >
          🏢 Commercial Roofing Inspection
        </button>

        <button
          onClick={() => handleSelect("residential")}
          className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded text-lg"
        >
          🏠 Residential Inspection (Coming Soon)
        </button>
      </div>
    </div>
  );
};

export default InspectionTypePage;
