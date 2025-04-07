import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Upload, Home, FileText, AlertCircle, Building, ClipboardList } from "lucide-react";
import { ImageUploader } from "./components/ImageUploader";
import { ReportViewer } from "./components/ReportViewer";
import { ProjectsPage } from "./components/ProjectsPage";
import { ProjectAnalysisPage } from "./components/ProjectAnalysisPage";
import { ProjectReportPage } from "./components/ProjectReportPage";
import InspectionForm from "./components/InspectionForm";

import { RoofDamageReport } from "./types/types";

function App() {
  return (
    <Router>
      <div style={{ padding: "1rem" }}>
        <h1>Roof-X Portal</h1>
        <nav style={{ display: "flex", gap: "1rem" }}>
          <Link to="/">Home</Link>
          <Link to="/upload">Upload</Link>
          <Link to="/report">Report Viewer</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/analysis">Analysis</Link>
          <Link to="/form">Inspection Form</Link>
        </nav>

        <Routes>
          <Route path="/" element={<h2>Welcome to Roof-X</h2>} />
          <Route path="/upload" element={<ImageUploader />} />
          <Route path="/report" element={<ReportViewer />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/analysis" element={<ProjectAnalysisPage />} />
          <Route path="/project-report" element={<ProjectReportPage />} />
          <Route path="/form" element={<InspectionForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
