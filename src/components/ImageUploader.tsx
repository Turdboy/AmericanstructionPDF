import React, { useState, useRef, useEffect } from 'react';
import { CompanyCamService, CompanyCamProject } from '../services/CompanyCamService';

interface ImageUploaderProps {
  onSubmit: (images: string[], notes: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onSubmit }) => {
  const [images, setImages] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // CompanyCam State
  const [showCompanyCam, setShowCompanyCam] = useState(false);
  const [projects, setProjects] = useState<CompanyCamProject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const companyCamService = new CompanyCamService();

  // Fetch Projects When Import is Clicked
  useEffect(() => {
    if (showCompanyCam) {
      setLoadingProjects(true);
      companyCamService.getProjects()
        .then(setProjects)
        .catch((err) => console.error(err))
        .finally(() => setLoadingProjects(false));
    }
  }, [showCompanyCam]);

  const handleFileChange = async (files: FileList | null) => {
    if (!files) return;
    const newImages = await Promise.all(
      Array.from(files).map((file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        })
      )
    );
    setImages([...images, ...newImages]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      alert('Please upload at least one image');
      return;
    }
    onSubmit(images, notes);
  };

  const importCompanyCamProject = async () => {
    if (!selectedProjectId) return;

    try {
      const photoUrls = await companyCamService.getProjectPhotos(selectedProjectId);
      console.log("Imported Photos:", photoUrls); // Debugging
      if (photoUrls.length === 0) {
        alert("No images found for this project.");
        return;
      }

      setImages((prev) => [...prev, ...photoUrls]);
      setShowCompanyCam(false);
    } catch (error) {
      console.error('Error importing photos:', error);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Drag & Drop Area */}
        <div
          className={`border-2 border-dashed p-6 rounded-lg text-center ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            accept="image/*"
            onChange={(e) => handleFileChange(e.target.files)}
          />
          <p className="text-gray-600">Drag and drop images here or click to select files</p>
        </div>

        {/* CompanyCam Import Button */}
        <button
          type="button"
          onClick={() => setShowCompanyCam(true)}
          className="w-full bg-gray-700 text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors"
        >
          Import from CompanyCam
        </button>

        {/* CompanyCam Project Selection */}
        {showCompanyCam && (
          <div className="p-4 bg-gray-100 rounded-md">
            <h3 className="text-lg font-semibold mb-2">Select a CompanyCam Project</h3>
            {loadingProjects ? (
              <p>Loading projects...</p>
            ) : (
              <ul className="space-y-2">
                {projects.map((project) => (
                  <li
                    key={project.id}
                    className={`p-2 rounded cursor-pointer ${
                      selectedProjectId === project.id ? 'bg-blue-500 text-white' : 'bg-white'
                    }`}
                    onClick={() => setSelectedProjectId(project.id)}
                  >
                    {project.name} ({project.photo_count} photos)
                  </li>
                ))}
              </ul>
            )}

            {/* Import Button (Only Shows After Selection) */}
            {selectedProjectId && (
              <button
                onClick={importCompanyCamProject}
                className="mt-3 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                Import Selected Project
              </button>
            )}
          </div>
        )}

        {/* Display Uploaded Images */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {images.map((img, index) => (
              <div key={index} className="relative">
                <img src={img} alt={`Upload ${index + 1}`} className="w-full h-48 object-cover rounded" />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                  onClick={() => setImages(images.filter((_, i) => i !== index))}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Submit Button */}
        <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
          Generate Report
        </button>
      </form>
    </div>
  );
};
