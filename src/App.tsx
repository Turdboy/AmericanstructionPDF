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
import GetStartedPage from "./components/GetStartedPage";
import ChooseHustlePage from "./components/chooseHustlePage";
import DesignPage from "./components/DesignPage";
import CustomInspectionPage from "./components/CustomInspectionPage"
import VysixLandingPage from "./components/VysixLandingPage";
import VysixProfilePage from "./components/VysixProfilePage";
import VysixEditProfilePage from "./components/VysixEditProfilePage";
import AboutMeJamesTyler from "./components/AboutMeJamesTyler"; 
import SignProposalPage from './components/SignProposalPage'; // 👈 ✅ Correct path for your case
import ClientProposalPage from "./components/ClientProposalPage";
import DesignInspectionPage from "./components/DesignInspectionPage"; // 👈 You'll create this next



import { useAuth } from "../hooks/useAuth"; // ✅ adjust path if needed




function VysixDropdown({ dropdownOpen, setDropdownOpen }) {
  const { user } = useAuth(); // ✅ NOW it's safe to use here
  const navigate = useNavigate();


  return (
    <div className="relative inline-block text-left">


      {dropdownOpen && (
        <div
          className="absolute left-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded shadow-lg z-50"
          onClick={(e) => e.stopPropagation()}
        >
          {[

            { label: "about me", path: "/vysix/shows" }
          ].map((item) => (
            <div
              key={item.label}
              onClick={() => {
                setDropdownOpen(false);
                if (!user) {
                  navigate("/login", { state: { from: item.path } });
                } else {
                  navigate(item.path);
                }
              }}
              className="px-4 py-2 text-sm hover:bg-gray-800 cursor-pointer"
            >
              {item.label}
            </div>
          ))}

          <div
            onClick={() => {
              auth.signOut();
              setDropdownOpen(false);
              navigate("/");
            }}
            className="px-4 py-2 text-sm text-red-400 hover:bg-gray-800 cursor-pointer"
          >
            Sign Out
          </div>
        </div>
      )}
    </div>
  );
}





function MainPage() {
  return (
    <div className="flex flex-col items-center space-y-4 min-h-[60vh]"></div>
  );
}

function App() {



const [dropdownOpen, setDropdownOpen] = useState(false);

useEffect(() => {
  const close = () => setDropdownOpen(false);
  window.addEventListener("click", close);
  return () => window.removeEventListener("click", close);
}, []);





  return (
    <AuthProvider>
    <Router>
      <div className="min-h-screen bg-white">
        {/* 🌈 Gradient Header based on logo */}
        {/* Desktop & Tablet Header */}
<div className="hidden sm:block">
<header className="bg-[#7C3AED] text-white z-50 relative shadow-md">



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




<VysixDropdown dropdownOpen={dropdownOpen} setDropdownOpen={setDropdownOpen} />




      </div>

      <div className="flex space-x-2 items-center">
       
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


  <Route path="/vysix/profile/edit" element={<VysixEditProfilePage />} />


  {/* 🔐 Authentication */}
  <Route path="/account" element={<AuthGatewayPage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/create-account" element={<CreateAccountPage />} />

  {/* ✅ Protected (after login) */}
  <Route path="/projects" element={<ProjectsPage />} />
  <Route path="/vysix" element={<VysixLandingPage />} />
  <Route path="/vysix/dashboard" element={<TVDashboardPage />} />


  <Route path="/projects/:id" element={<ProjectAnalysisPage />} />
  <Route path="/estimator" element={<EstimatorPage />} />

  <Route path="/projects/:id/report" element={<ProjectReportPage />} />
  <Route path="/get-started" element={<GetStartedPage />} />
  <Route path="/vysix/profile" element={<VysixProfilePage />} />
    <Route path="/vysix/shows" element={<AboutMeJamesTyler />} />


  <Route path="/survey-proposal" element={<SurveyProposalPage />} />
  <Route path="/landingpagetvtracker" element={<LandingPageTVTracker />} />
  <Route path="/design" element={<DesignPage />} />
<Route path="/vysix/dashboard" element={<TVDashboardPage />} />

  <Route path="/choose-hustle" element={<ChooseHustlePage />} />
  <Route path="/inspection/custom" element={<CustomInspectionPage />} />
  <Route path="/sign/:id" element={<SignProposalPage />} />


  

<Route path="/inspections/clientpage" element={<SignProposalPage />} />


  




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
<Route path="/design-inspection" element={<DesignInspectionPage />} />


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