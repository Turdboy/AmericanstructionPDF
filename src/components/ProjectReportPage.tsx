import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { RoofInspectionReport } from '../services/RoofAnalysisService';
import { CompanyCamService, CompanyCamProject } from '../services/CompanyCamService';
import { AlertCircle, Download, ChevronLeft, Camera } from 'lucide-react';

const companyCamService = new CompanyCamService();

export function ProjectReportPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<CompanyCamProject | null>(null);
  const [report, setReport] = useState<RoofInspectionReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProjectData();
  }, [id]);

  const loadProjectData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      
      // Load project data
      const projectData = await companyCamService.getProjects()
        .then(projects => projects.find(p => p.id === id));

      if (!projectData) {
        throw new Error('Project not found');
      }

      setProject(projectData);

      // Wait for report data to be available in sessionStorage
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds timeout
      const checkForReport = async () => {
        const reportData = sessionStorage.getItem(`report_${id}`);
        if (reportData) {
          try {
            const parsedReport = JSON.parse(reportData);
            setReport(parsedReport);
            setLoading(false);
          } catch (err) {
            console.error('Failed to parse report data:', err);
            setError('Failed to load report data. Please try analyzing the project again.');
            setLoading(false);
          }
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(checkForReport, 1000); // Check every second
        } else {
          setError('Report data not found. Please try analyzing the project again.');
          setLoading(false);
        }
      };

      checkForReport();
    } catch (err) {
      setError('Failed to load report data. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002147] mb-4"></div>
        <p className="text-gray-600">Loading report data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <p>{error}</p>
          </div>
          <Link
            to={`/projects/${id}`}
            className="mt-4 inline-flex items-center text-red-700 hover:text-red-800"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Project
          </Link>
        </div>
      </div>
    );
  }

  if (!report || !project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <p>No report data available. Please analyze the project first.</p>
          </div>
          <Link
            to={`/projects/${id}`}
            className="mt-4 inline-flex items-center text-yellow-700 hover:text-yellow-800"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Project
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link
            to={`/projects/${id}`}
            className="flex items-center text-[#002147] hover:text-[#003167]"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Project
          </Link>
          <button className="flex items-center bg-[#002147] text-white px-4 py-2 rounded hover:bg-[#003167]">
            <Download className="w-5 h-5 mr-2" />
            Download Report
          </button>
        </div>

        {/* Report Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#002147]">
              Americanstruction Commercial Inspection Summary
            </h1>
            <p className="text-xl text-gray-600 mt-2">
              {project?.address.street_address_1}
            </p>
            <p className="text-gray-600">
              {project?.address.city}, {project?.address.state} {project?.address.postal_code}
            </p>
          </div>

          {/* Property Info Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-semibold text-[#002147] mb-4">
                Roof Condition Overview
              </h2>
              <div className="space-y-2">
                <InfoRow label="General Condition" value={report?.roofCondition.generalCondition || 'Poor'} />
                <InfoRow label="Past Repairs" value={report?.roofCondition.repairs ? 'Yes' : 'No'} />
                <InfoRow label="Leaks" value={report?.roofCondition.leaks ? 'Yes' : 'No'} />
                <InfoRow label="Ponding" value={report?.roofCondition.ponding ? 'Yes' : 'No'} />
                <InfoRow label="Useful Life" value={report?.roofCondition.usefulLife || 'Exceeded'} />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#002147] mb-4">
                Roof Components
              </h2>
              <div className="space-y-2">
                <InfoRow label="Roof Cover" value={report?.components.roofCover || ''} />
                <InfoRow label="Deck Type" value={report?.components.deckType || ''} />
                <InfoRow label="Roof Slope" value={report?.components.roofSlope || ''} />
                <InfoRow label="Insulation" value={report?.components.insulation || ''} />
                <InfoRow label="Thickness" value={report?.components.thickness || ''} />
              </div>
            </div>
          </div>

          {/* Image Categories */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[#002147] mb-4">
              Inspection Photos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {report?.images.map((image, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="aspect-video relative mb-3">
                    <img
                      src={image.annotated || image.original}
                      alt={image.description}
                      className="w-full h-full object-cover rounded"
                    />
                    {image.annotated && (
                      <div className="absolute top-2 right-2 bg-yellow-400 text-[#002147] px-2 py-1 rounded text-sm font-medium">
                        Annotated
                      </div>
                    )}
                  </div>
                  <h3 className="font-medium text-[#002147]">{image.category}</h3>
                  <p className="text-gray-600 text-sm mt-1">{image.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Summary and Recommendations */}
          <div>
            <h2 className="text-xl font-semibold text-[#002147] mb-4">
              Summary and Recommendations
            </h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 mb-6">{report?.summary}</p>
              <h3 className="font-medium text-[#002147] mb-3">Recommendations:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {report?.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-600 text-sm">
          <p>Report generated by Americanstruction AI Analysis System</p>
          <p className="mt-1">© {new Date().getFullYear()} Americanstruction. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-600">{label}:</span>
      <span className="font-medium text-[#002147]">{value}</span>
    </div>
  );
}