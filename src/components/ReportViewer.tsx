
import React, { useState, useRef, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { CompanyCamService } from '../services/CompanyCamService';

const companyCamService = new CompanyCamService();

interface ReportViewerProps {
  projectId: string; // Project ID from CompanyCam
}

export const ReportViewer: React.FC<ReportViewerProps> = ({ projectId }) => {
  const [images, setImages] = useState<string[]>([]);
  const reportRef = useRef<HTMLDivElement>(null);

  // Fetch images on load
  useEffect(() => {
    const fetchImages = async () => {
      const fetchedImages = await companyCamService.getTopImages(projectId);
      setImages(fetchedImages);
    };
    fetchImages();
  }, [projectId]);

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });

    // Add title
    pdf.setFontSize(22);
    pdf.text('Roof Damage Report', 20, 40);

    // Add Cover Image
    if (images.length > 0) {
      const coverImage = images[0];
      const img = new Image();
      img.src = coverImage;
      img.onload = () => {
        pdf.addImage(img, 'JPEG', 20, 60, 400, 250);
        pdf.save('Roof_Damage_Report.pdf');
      };
    }

    // Add Images (Limit to 20)
    let yPosition = 330;
    images.slice(1, 20).forEach((imgUrl, index) => {
      if (yPosition > 750) {
        pdf.addPage();
        yPosition = 60;
      }

      const img = new Image();
      img.src = imgUrl;
      img.onload = () => {
        pdf.addImage(img, 'JPEG', 20, yPosition, 200, 150);
        yPosition += 160;
        if (index === images.length - 1) pdf.save('Roof_Damage_Report.pdf');
      };
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Roof Damage Report</h2>
      <button
        onClick={handleDownloadPDF}
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
      >
        Download Report (PDF)
      </button>
    </div>
  );
};
