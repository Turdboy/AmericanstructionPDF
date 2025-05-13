import React from "react";
import { generatePowerWashingPDF } from "../../utils/generatePowerWashingPDF";

const PowerWashingForm = ({
  data = {},
  onChange = () => {},
  coverDesign = {},
  shapes = [],
  texts = [],
  designs = [],
  images = [],
}) => {
  const handleChange = (key, value) => {
    onChange({ ...data, [key]: value });
  };

const handleGeneratePDF = () => {
  generatePowerWashingPDF(data, {
    ...coverDesign,
    shapes,
    texts,
    designs,
    images,
  });
};


  return (
    <div className="space-y-4 p-4">
      <label className="block">
        Surface Type:
        <input
          type="text"
          value={data.surface || ""}
          onChange={(e) => handleChange("surface", e.target.value)}
          className="w-full border p-2 rounded"
        />
      </label>

      <label className="block">
        Square Footage:
        <input
          type="number"
          value={data.sqft || ""}
          onChange={(e) => handleChange("sqft", e.target.value)}
          className="w-full border p-2 rounded"
        />
      </label>

      <label className="block">
        Special Instructions:
        <textarea
          value={data.notes || ""}
          onChange={(e) => handleChange("notes", e.target.value)}
          className="w-full border p-2 rounded"
        />
      </label>

      <button
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        onClick={handleGeneratePDF}
      >
        Generate My Quote PDF
      </button>
    </div>
  );
};

export default PowerWashingForm;
