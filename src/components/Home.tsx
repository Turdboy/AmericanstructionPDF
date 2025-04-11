import React from "react";
import { useNavigate } from "react-router-dom";

const RevisitPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto mt-12 text-center">
      <h1 className="text-4xl font-bold text-[#002147] mb-6">Welcome to Roof-X</h1>
      <p className="text-lg text-gray-600 mb-8">
        Streamline your commercial roof inspections with powerful tools to document, report, and
        generate professional proposals — all in one place.
      </p>

      {/* Buttons */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => navigate("/inspection")}
          className="bg-[#FF6B6B] text-white px-4 py-2 rounded hover:bg-[#FF4B4B] transition"
        >
          Start New Inspection
        </button>
        <button
          onClick={() => navigate("/edit-proposal")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Edit Proposal
        </button>
      </div>

      {/* Job Timeline Below */}
      <div className="mt-20 max-w-2xl mx-auto text-left">
        <h2 className="text-2xl font-bold text-[#002147] mb-6 text-center">Job Timeline</h2>
        <ul className="relative border-l border-gray-300 space-y-8">
          <li className="ml-6">
            <div className="absolute w-4 h-4 bg-green-500 rounded-full -left-2 top-1"></div>
            <h3 className="font-semibold text-gray-800">Inspection Started</h3>
            <p className="text-sm text-gray-500">April 8, 2025</p>
          </li>
          <li className="ml-6">
            <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-2 top-1"></div>
            <h3 className="font-semibold text-gray-800">PDF Submitted</h3>
            <p className="text-sm text-gray-500">April 9, 2025</p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RevisitPage;
