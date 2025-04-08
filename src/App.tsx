import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ClipboardList } from "lucide-react";
import { ProjectsPage } from "./components/ProjectsPage";
import { ProjectAnalysisPage } from "./components/ProjectAnalysisPage";
import { ProjectReportPage } from "./components/ProjectReportPage";
import InspectionForm from "./components/InspectionForm";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { generatePDF } from "./utils/pdfGenerator"; // ← Make sure this path is correct
import RevisitPage from "./components/RevisitPage";
import EditProposalPage from "./components/EditProposalPage";



function MainPage() {
  return (
    <div className="flex flex-col items-center space-y-4 min-h-[60vh]">

    </div>
  );
}



function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-[#002147] text-white">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex space-x-4">
              <Link
                to="/inspection"
                className="bg-[#FF6B6B] text-white px-4 py-2 rounded hover:bg-[#FF4B4B] transition"
              >
                Start Inspection
              </Link>
              <Link
                to="/revisit"
                className="bg-[#FFC107] text-[#002147] px-4 py-2 rounded hover:bg-[#FFD54F] transition"
              >
                Revisit Old Inspections
              </Link>
              <Link
  to="/edit-proposal"
  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
>
  Edit Proposal
</Link>

            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectAnalysisPage />} />
            <Route path="/projects/:id/report" element={<ProjectReportPage />} />
            <Route path="/revisit" element={<RevisitPage />} />
            <Route path="/edit-proposal" element={<EditProposalPage />} />

            <Route
              path="/inspection"
              element={
                <InspectionForm
                  onSubmit={(data) => {
                    const existing = JSON.parse(localStorage.getItem("savedInspections") || "[]");
                    const { images, overviewImages, droneImages, ...textOnlyData } = data;
                    const newInspection = {
                      ...textOnlyData,
                      id: crypto.randomUUID(),
                      date: new Date().toISOString(),
                    };
                    localStorage.setItem(
                      "savedInspections",
                      JSON.stringify([newInspection, ...existing])
                    );
                    console.log("📝 Saved inspection (text only):", newInspection);
                  }}
                />
              }
            />
            <Route path="/v1/*" element={<MainPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}


export default App;
