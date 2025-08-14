import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CompanyCamService, CompanyCamProject, CompanyCamPhoto } from '../services/CompanyCamService';
import { RoofAnalysisService, RoofInspectionReport } from '../services/RoofAnalysisService';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const companyCamService = new CompanyCamService();
const roofAnalysisService = new RoofAnalysisService();

interface AnalysisStep {
  label: string;
  status: 'pending' | 'processing' | 'complete' | 'error';
}

export function ProjectAnalysisPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<CompanyCamProject | null>(null);
  const [photos, setPhotos] = useState<CompanyCamPhoto[]>([]);
  const [report, setReport] = useState<RoofInspectionReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [steps, setSteps] = useState<AnalysisStep[]>([
    { label: 'Loading project data', status: 'pending' },
    { label: 'Analyzing images', status: 'pending' },
    { label: 'Generating annotations', status: 'pending' },
    { label: 'Creating final report', status: 'pending' }
  ]);

  const updateStepStatus = (index: number, status: AnalysisStep['status']) => {
    setSteps(current => 
      current.map((step, i) => 
        i === index ? { ...step, status } : step
      )
    );
  };

  useEffect(() => {
    loadProjectData();
  }, [id]);

  const loadProjectData = async () => {
    if (!id) return;
    
    try {
      updateStepStatus(0, 'processing');
      setLoading(true);
      setError(null);
      
      // Load project details and photos in parallel
      const [projectData, photosData] = await Promise.all([
        companyCamService.getProjects().then(projects => 
          projects.find(p => p.id === id)
        ),
        companyCamService.getProjectPhotos(id)
      ]);

      if (!projectData) {
        throw new Error('Project not found');
      }

      setProject(projectData);
      setPhotos(photosData);
      updateStepStatus(0, 'complete');

      // Start analysis automatically
      startAnalysis(photosData);
    } catch (err) {
      updateStepStatus(0, 'error');
      setError('Failed to load project data. Please try again.');
      setLoading(false);
    }
  };

  const startAnalysis = async (projectPhotos: CompanyCamPhoto[]) => {
    try {
      // Step 2: Analyze Images
      updateStepStatus(1, 'processing');
      console.log('Processing photos:', projectPhotos);
      
      // Get high-quality image URLs - prefer original over web over thumbnail
      const imageUrls = projectPhotos
        .map(photo => {
          console.log('Processing photo:', photo);
          
          // Find the best quality URL from uris
          const originalUri = photo.uris.find(u => u.type === 'original')?.uri;
          const webUri = photo.uris.find(u => u.type === 'web')?.uri;
          const thumbnailUri = photo.uris.find(u => u.type === 'thumbnail')?.uri;
          
          // Use the highest quality available
          const bestUrl = originalUri || webUri || thumbnailUri;
          console.log('Selected URL for photo:', bestUrl);
          return bestUrl;
        })
        .filter((url): url is string => url !== undefined);
      
      console.log('Image URLs to analyze:', imageUrls);
      
      if (imageUrls.length === 0) {
        throw new Error('No valid image URLs found in project photos');
      }

      const analysisReport = await roofAnalysisService.analyzeImages(imageUrls);
      updateStepStatus(1, 'complete');

      // Step 3: Generate Annotations
      updateStepStatus(2, 'processing');
      // This is handled within analyzeImages
      updateStepStatus(2, 'complete');

      // Step 4: Create Report
      updateStepStatus(3, 'processing');
      setReport(analysisReport);

      // Store report in sessionStorage
      try {
        sessionStorage.setItem(`report_${id}`, JSON.stringify(analysisReport));
      } catch (storageError) {
        console.error('Failed to store report in sessionStorage:', storageError);
      }

      updateStepStatus(3, 'complete');

      // Navigate to report view after ensuring the report is stored
      navigate(`/projects/${id}/report`);
    } catch (err) {
      const failedStep = steps.findIndex(step => step.status === 'processing');
      if (failedStep !== -1) {
        updateStepStatus(failedStep, 'error');
      }
      setError('Failed to analyze images. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-[#002147] mb-8 text-center">
          Analyzing Project
        </h1>

        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-8">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              <p>{error}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`bg-white rounded-lg shadow p-4 flex items-center justify-between
                  ${step.status === 'error' ? 'border-red-400 border' : ''}`}
              >
                <div className="flex items-center">
                  {step.status === 'processing' && (
                    <Loader2 className="w-5 h-5 mr-3 text-[#002147] animate-spin" />
                  )}
                  {step.status === 'complete' && (
                    <CheckCircle2 className="w-5 h-5 mr-3 text-green-500" />
                  )}
                  {step.status === 'error' && (
                    <AlertCircle className="w-5 h-5 mr-3 text-red-500" />
                  )}
                  <span className={step.status === 'pending' ? 'text-gray-400' : 'text-gray-900'}>
                    {step.label}
                  </span>
                </div>
                {step.status === 'complete' && (
                  <span className="text-green-500 text-sm">Complete</span>
                )}
              </div>
            ))}
          </div>
        )}

        {project && (
          <div className="mt-8 text-center text-gray-600">
            <p className="font-medium">{project.name}</p>
            <p className="text-sm">
              {project.address.street_address_1}<br />
              {project.address.city}, {project.address.state} {project.address.postal_code}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 