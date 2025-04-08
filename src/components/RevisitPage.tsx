import React from "react";
import { useNavigate } from "react-router-dom";
import { generatePDF } from "../utils/pdfGenerator";

const RevisitPage = () => {
  const navigate = useNavigate();
  const inspections = JSON.parse(localStorage.getItem("savedInspections") || "[]");

  const handleEdit = (inspection: any) => {
    localStorage.setItem("activeInspectionDraft", JSON.stringify(inspection));
navigate("/inspection");

  };

  const handlePDF = (inspection: any) => {
    generatePDF(inspection);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6 text-[#002147]">Saved Inspections</h1>
      {inspections.length === 0 ? (
        <p className="text-gray-500">No inspections saved yet.</p>
      ) : (
        <div className="space-y-4">
          {inspections.map((inspection: any, index: number) => (
            <div
              key={inspection.id || index}
              className="bg-white shadow rounded p-4 border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center"
            >
              <div>
                <p className="font-semibold text-[#002147]">
                  {inspection.propertyName || `Project ${index + 1}`}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(inspection.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-2 mt-2 sm:mt-0">
                <button
                  onClick={() => handleEdit(inspection)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Edit Inspection
                </button>
                <button
                  onClick={() => handlePDF(inspection)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Generate PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RevisitPage;
