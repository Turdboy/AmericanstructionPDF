import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ProjectsPage } from "./components/ProjectsPage";
import { ProjectAnalysisPage } from "./components/ProjectAnalysisPage";
import { ProjectReportPage } from "./components/ProjectReportPage";
import InspectionForm from "./components/InspectionForm";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { generatePDF } from "./utils/pdfGenerator";
import RevisitPage from "./components/Home";
import EditProposalPage from "./components/EditProposalPage";
import LoginPage from "./components/LoginPage";
import CreateAccountPage from "./components/CreateAccountPage";
import AccountPage from "./components/AccountPage";
import EstimatorPage from "./components/EstimatorPage";
import LandingPage from "./components/LandingPage";
import SavedInspectionPage from "./components/SavedInspectionPage";



function MainPage() {
  return (
    <div className="flex flex-col items-center space-y-4 min-h-[60vh]"></div>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        {/* 🌈 Gradient Header based on logo */}
        <header className="bg-gradient-to-r from-[#FBA504] to-[#E83286] text-white z-50 relative">


          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex space-x-4">
          <Link
                to="/"
                className="bg-black text-white px-4 py-2 rounded hover:bg-white hover:text-black transition"
              >
                Home
              </Link>
  <Link
    to="/revisit"
    className="bg-black text-white px-4 py-2 rounded hover:bg-white hover:text-black transition"
  >
    Revisit Inspections
  </Link>
  <Link
    to="/inspection"
    className="bg-black text-white px-4 py-2 rounded hover:bg-white hover:text-black transition"
  >
    Start Inspection
  </Link>

  <Link
    to="/estimator"
    className="bg-black text-white px-4 py-2 rounded hover:bg-white hover:text-black transition"
  >
    Estimate Calculator
  </Link>
</div>


<div>
  <Link
    to="/account"
    className="bg-black text-white px-4 py-2 rounded hover:bg-white hover:text-black transition"
  >
    Account
  </Link>
</div>

          </div>
        </header>

        {/* Routes */}
        <Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/loginPage" element={<LoginPage />} />
  <Route path="/account" element={<AccountPage />} />
  <Route path="/create-account" element={<CreateAccountPage />} />
  <Route path="/projects" element={<ProjectsPage />} />
  <Route path="/projects/:id" element={<ProjectAnalysisPage />} />
  <Route path="/projects/:id/report" element={<ProjectReportPage />} />
  <Route path="/revisit" element={<SavedInspectionPage />} />
  <Route path="/estimator" element={<EstimatorPage />} />
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
      </div>
    </Router>
  );
}

export default App;
