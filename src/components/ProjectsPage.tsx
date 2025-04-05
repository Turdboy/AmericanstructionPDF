<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { CompanyCamProject, CompanyCamService } from '../services/CompanyCamService';
import { MapPin, Calendar, Camera, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const companyCamService = new CompanyCamService();

export function ProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<CompanyCamProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<CompanyCamProject | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await companyCamService.getProjects();
      setProjects(data);
    } catch (err) {
      setError('Failed to load projects. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSelect = (project: CompanyCamProject) => {
    setSelectedProject(project);
  };

  const handleGenerateReport = () => {
    if (selectedProject) {
      navigate(`/projects/${selectedProject.id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002147]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-[#002147]">CompanyCam Projects</h1>
        <button
          onClick={handleGenerateReport}
          disabled={!selectedProject}
          className={`flex items-center px-6 py-3 rounded-lg text-white
            ${selectedProject 
              ? 'bg-[#002147] hover:bg-[#003167] cursor-pointer' 
              : 'bg-gray-400 cursor-not-allowed'}`}
        >
          <FileText className="w-5 h-5 mr-2" />
          Generate Report
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 cursor-pointer
              ${selectedProject?.id === project.id ? 'ring-2 ring-[#002147]' : ''}`}
            onClick={() => handleProjectSelect(project)}
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold text-[#002147] mb-4">{project.name}</h3>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>
                    {project.address.street_address_1}, {project.address.city}, {project.address.state} {project.address.postal_code}
                  </span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>{new Date(project.created_at * 1000).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Camera className="w-5 h-5 mr-2" />
                  <span>{project.photo_count} photos</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-3">
              <a
                href={project.public_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#002147] hover:text-[#003167] font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                View in CompanyCam →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
=======
import React, { useEffect, useState } from 'react';
import { CompanyCamProject, CompanyCamService } from '../services/CompanyCamService';
import { MapPin, Calendar, Camera, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const companyCamService = new CompanyCamService();

export function ProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<CompanyCamProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<CompanyCamProject | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await companyCamService.getProjects();
      setProjects(data);
    } catch (err) {
      setError('Failed to load projects. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSelect = (project: CompanyCamProject) => {
    setSelectedProject(project);
  };

  const handleGenerateReport = () => {
    if (selectedProject) {
      navigate(`/projects/${selectedProject.id}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002147]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-[#002147]">CompanyCam Projects</h1>
        <button
          onClick={handleGenerateReport}
          disabled={!selectedProject}
          className={`flex items-center px-6 py-3 rounded-lg text-white
            ${selectedProject 
              ? 'bg-[#002147] hover:bg-[#003167] cursor-pointer' 
              : 'bg-gray-400 cursor-not-allowed'}`}
        >
          <FileText className="w-5 h-5 mr-2" />
          Generate Report
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105 cursor-pointer
              ${selectedProject?.id === project.id ? 'ring-2 ring-[#002147]' : ''}`}
            onClick={() => handleProjectSelect(project)}
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold text-[#002147] mb-4">{project.name}</h3>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>
                    {project.address.street_address_1}, {project.address.city}, {project.address.state} {project.address.postal_code}
                  </span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>{new Date(project.created_at * 1000).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Camera className="w-5 h-5 mr-2" />
                  <span>{project.photo_count} photos</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-3">
              <a
                href={project.public_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#002147] hover:text-[#003167] font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                View in CompanyCam →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
>>>>>>> ecb285a5 (final update)
} 