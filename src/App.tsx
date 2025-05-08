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
import AuthGatewayPage from "./components/AuthGatewayPage";
import MobileLandingPage from './components/MobileLandingPage';
import InspectionTypePage from "./components/InspectionTypePage";
import VpaiLogo from './images/vpai-logo.png';
import landingPageImage from './images/preview.png';
import SurveyProposalPage from "./components/SurveyProposalPage";
import MobileHeader from "./components/MobileHeader";
import LandingPageTVTracker from "./components/LandingPageTVTracker";
import { AuthProvider } from "../contexts/AuthContext";
import TVDashboardPage from "./components/TVDashboard";














function MainPage() {
  return (
    <div className="flex flex-col items-center space-y-4 min-h-[60vh]"></div>
  );
}

function App() {
  return (
    <AuthProvider>
    <Router>
      <div className="min-h-screen bg-white">
        {/* 🌈 Gradient Header based on logo */}
        {/* Desktop & Tablet Header */}
<div className="hidden sm:block">
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
          to="/landingpagetvtracker"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          TV Tracker
        </Link>
      </div>

      <div className="flex space-x-2 items-center">
        <a
          href="https://www.linkedin.com/company/106768017/admin/dashboard/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          LinkedIn
        </a>
        <a
          href="https://www.instagram.com/vpaiproposaltool/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition"
        >
          Instagram
        </a>
        <Link
          to="/account"
          className="bg-black text-white px-4 py-2 rounded hover:bg-white hover:text-black transition"
        >
          Account
        </Link>
      </div>
    </div>
  </header>
</div>

{/* Mobile Header (renders nothing) */}
<MobileHeader />


        {/* Routes */}
        <Routes>
  {/* 🌟 Landing/Home */}
  <Route path="/" element={<LandingPage />} />

  {/* 🔐 Authentication */}
  <Route path="/account" element={<AuthGatewayPage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/create-account" element={<CreateAccountPage />} />

  {/* ✅ Protected (after login) */}
  <Route path="/projects" element={<ProjectsPage />} />
  <Route path="/projects/:id" element={<ProjectAnalysisPage />} />
  <Route path="/estimator" element={<EstimatorPage />} />

  <Route path="/projects/:id/report" element={<ProjectReportPage />} />
  <Route path="/survey-proposal" element={<SurveyProposalPage />} />
  <Route path="/landingpagetvtracker" element={<LandingPageTVTracker />} />
  <Route path="/tv-dashboard" element={<TVDashboardPage />} />


  <Route path="/inspection" element={<InspectionTypePage />} />
  <Route path="/inspection/commercial" element={
  <InspectionForm
    onSubmit={(data) => {
      const existing = JSON.parse(localStorage.getItem("savedInspections") || "[]");
      const { images, overviewImages, droneImages, ...textOnlyData } = data;
      const newInspection = {
        ...textOnlyData,
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
      };
      localStorage.setItem("savedInspections", JSON.stringify([newInspection, ...existing]));
      console.log("📝 Saved inspection (text only):", newInspection);
    }}
  />
} />

  <Route path="/edit-proposal" element={<EditProposalPage />} />
  <Route path="/revisit" element={<SavedInspectionPage />} />

  {/* 🛠 Other */}
  <Route path="/v1/*" element={<MainPage />} />
  <Route path="/mobile" element={<MobileLandingPage />} />

</Routes>

      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;