import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Upload, Home, FileText, AlertCircle, Building, ClipboardList } from "lucide-react";
import { ImageUploader } from "./components/ImageUploader";
import { ReportViewer } from "./components/ReportViewer";
import { ProjectsPage } from "./components/ProjectsPage";
import { ProjectAnalysisPage } from "./components/ProjectAnalysisPage";
import { ProjectReportPage } from "./components/ProjectReportPage";
import InspectionForm from "./components/InspectionForm";
import { GeminiService } from "./services/GeminiService";
import { RoofDamageReport } from "./types/types";

const geminiService = new GeminiService();

function MainPage() {
  const [report, setReport] = useState<RoofDamageReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (images: string[], notes: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await geminiService.analyzeRoofDamage(images, notes);
      setReport(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while analyzing the images");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReportUpdate = (updatedReport: RoofDamageReport) => {
    setReport(updatedReport);
  };

  return (
    <div>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#002147]">AI-Powered Roof Analysis</h1>

          <div className="flex space-x-4">
            <Link
              to="/projects"
              className="bg-[#002147] text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-[#003167] transition-colors"
            >
              <Building className="w-5 h-5" />
              <span>View Projects</span>
            </Link>
            <Link
              to="/inspection"
              className="bg-[#FF6B6B] text-white px-6 py-3 rounded-lg flex items-center space-x-2 hover:bg-[#FF4B4B] transition-colors"
            >
              <ClipboardList className="w-5 h-5" />
              <span>Start Inspection</span>
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-8">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {isLoading && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002147] mx-auto mb-4"></div>
            <p className="text-gray-600">Analyzing your roof images...</p>
          </div>
        )}

        {!report && !isLoading && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <ImageUploader onSubmit={handleSubmit} />
          </div>
        )}

        {report && (
          <div className="mb-8">
            <button
              onClick={() => setReport(null)}
              className="mb-6 bg-[#002147] text-white py-2 px-4 rounded-lg hover:bg-[#003167] transition-colors"
            >
              Upload New Images
            </button>
            <ReportViewer report={report} onUpdate={handleReportUpdate} />
          </div>
        )}

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Home className="w-8 h-8 text-[#002147]" />}
            title="AI Detection"
            description="Advanced damage detection using custom AI ML roof processing technology"
          />
          <FeatureCard
            icon={<AlertCircle className="w-8 h-8 text-[#002147]" />}
            title="Visual Annotations"
            description="Clear highlighting of problem areas with detailed markers"
          />
          <FeatureCard
            icon={<FileText className="w-8 h-8 text-[#002147]" />}
            title="Detailed Reports"
            description="Comprehensive reports with damage analysis"
          />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-[#002147] text-white">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-2">
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 bg-[#FF6B6B] rounded-full"></div>
                  <div className="absolute inset-1 bg-[#002147] transform rotate-45">
                    <div className="w-4 h-4 bg-[#002147] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                  </div>
                </div>
                <span className="text-2xl font-bold">Americanstruction</span>
              </Link>
              <button className="bg-[#FFC107] text-[#002147] px-6 py-2 rounded font-semibold hover:bg-[#FFD54F] transition-colors">
                Contact Us
              </button>
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
            <Route path="/inspection" element={<InspectionForm onSubmit={(data) => console.log(data)} />} />
            <Route path="/v1/*" element={<MainPage />} /> {/* Version 1 routes */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-[#002147] mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export default App;
