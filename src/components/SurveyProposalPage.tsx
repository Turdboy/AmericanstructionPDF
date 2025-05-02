// components/SurveyProposalPage.tsx
import React, { useState } from "react";
import { generateSurveyPDF } from "../utils/pdfGenerator"; // we'll create this next

const SurveyProposalPage: React.FC = () => {
  const [clientName, setClientName] = useState("");
  const [projectAddress, setProjectAddress] = useState("");
  const [surveyAnswers, setSurveyAnswers] = useState("");

  const handleGeneratePDF = () => {
    generateSurveyPDF({ clientName, projectAddress, surveyAnswers });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 space-y-4 bg-gray-100">
      <h1 className="text-3xl font-bold text-center text-[#002147]">Survey Proposal</h1>

      <input
        type="text"
        placeholder="Client Name"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
        className="p-2 border rounded w-full max-w-md"
      />

      <input
        type="text"
        placeholder="Project Address"
        value={projectAddress}
        onChange={(e) => setProjectAddress(e.target.value)}
        className="p-2 border rounded w-full max-w-md"
      />

      <textarea
        placeholder="Survey Answers"
        value={surveyAnswers}
        onChange={(e) => setSurveyAnswers(e.target.value)}
        className="p-2 border rounded w-full max-w-md h-40"
      />

      <button
        onClick={handleGeneratePDF}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        Generate Survey Proposal
      </button>
    </div>
  );
};

export default SurveyProposalPage;
