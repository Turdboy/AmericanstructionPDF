import React, { useState } from "react";
import { generatePDF } from "../utils/pdfGenerator";

const SurveyProposalPage: React.FC = () => {
  const [formData, setFormData] = useState({
    projectName: "",
    clientName: "",
    proposalDetails: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGeneratePDF = () => {
    generatePDF(formData);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4 text-center">Proposal PDF Demo</h1>

      <input
        type="text"
        name="projectName"
        placeholder="Project Name"
        value={formData.projectName}
        onChange={handleChange}
        className="p-2 border border-gray-300 rounded mb-2 w-full max-w-md"
      />

      <input
        type="text"
        name="clientName"
        placeholder="Client Name"
        value={formData.clientName}
        onChange={handleChange}
        className="p-2 border border-gray-300 rounded mb-2 w-full max-w-md"
      />

      <textarea
        name="proposalDetails"
        placeholder="Proposal Details"
        value={formData.proposalDetails}
        onChange={handleChange}
        className="p-2 border border-gray-300 rounded mb-4 w-full max-w-md"
        rows={4}
      />

      <button
        onClick={handleGeneratePDF}
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded transition"
      >
        Generate PDF
      </button>
    </div>
  );
};

export default SurveyProposalPage;
