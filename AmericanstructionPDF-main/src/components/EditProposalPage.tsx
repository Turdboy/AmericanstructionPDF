import React, { useState } from "react";

const EditProposalPage = () => {
  const [primaryColor, setPrimaryColor] = useState("#002147"); // Default dark blue
  const [accentColor, setAccentColor] = useState("#FFC107");  // Default yellow
  const [brandingImages, setBrandingImages] = useState<File[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setBrandingImages(Array.from(event.target.files));
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      <h1 className="text-2xl font-bold text-[#002147]">Edit Proposal</h1>
      <p className="text-gray-600">
        Select two brand colors and upload any logos, watermarks, or design elements you'd like to appear in your proposals.
      </p>

      {/* Color Selection */}
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex flex-col space-y-2">
          <label className="font-semibold">Primary Brand Color</label>
          <input
            type="color"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
            className="w-16 h-10 border rounded"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="font-semibold">Accent Color</label>
          <input
            type="color"
            value={accentColor}
            onChange={(e) => setAccentColor(e.target.value)}
            className="w-16 h-10 border rounded"
          />
        </div>
      </div>

      {/* Branding Image Upload */}
      <div className="space-y-2">
        <label className="font-semibold block">Upload Branding Images</label>
        <input type="file" multiple accept="image/*" onChange={handleFileUpload} />
        {brandingImages.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
            {brandingImages.map((file, index) => (
              <img
                key={index}
                src={URL.createObjectURL(file)}
                alt={`Brand Image ${index + 1}`}
                className="h-32 object-contain border rounded shadow"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProposalPage;
