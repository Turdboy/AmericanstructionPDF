import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";



const DesignPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const field = location.state?.field;

  const [coverDesign, setCoverDesign] = useState({
  primaryColor: "#ffffff",
  secondaryColor: "#ffffff",
});


const [showTextBoxOptions, setShowTextBoxOptions] = useState(false);
const [showBoxOptions, setShowBoxOptions] = useState(false);
const [showAccentBoxOptions, setShowAccentBoxOptions] = useState(false);
const [textBoxText, setTextBoxText] = useState("");
const [textBoxPosition, setTextBoxPosition] = useState({ x: 50, y: 50 });
const [isDragging, setIsDragging] = useState(false);
const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
const [hasTextBox, setHasTextBox] = useState(false);
const [textBoxSize, setTextBoxSize] = useState({ width: 100, height: 30 });
const [isResizing, setIsResizing] = useState(false);





  if (!field) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-red-500">No field selected. Please go back and choose a field.</p>
      </div>
    );
  }

  const handleContinue = () => {
    navigate("/form-builder", {
      state: { field, coverDesign },
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col sm:flex-row px-6 py-12">

      {/* Left Side: Inputs */}
      <div className="w-full sm:w-1/2 pr-6 space-y-4">
        <h1 className="text-3xl font-bold mb-2">Customize Your Bid</h1>
        <p className="text-gray-400">You selected: <span className="text-purple-400 font-semibold">{field}</span></p>


{/* Graphics Section */}
<div className="mb-6">
  <h2 className="text-xl font-bold mb-2 mt-6">Add Graphics</h2>
  <div className="flex flex-col space-y-3">

    {/* Text Box */}
    <div>
      <button
        className="bg-gray-800 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded shadow transition w-full text-left"
        onClick={() => setShowTextBoxOptions(prev => !prev)}
      >
         Add Text Box
      </button>
      {showTextBoxOptions && (
        <div className="bg-gray-700 p-4 mt-2 rounded shadow-inner">
          <div className="bg-gray-700 p-4 mt-2 rounded shadow-inner space-y-2">

                 {/* Primary Color Picker */}
<div className="mb-4">
  <label className="block text-gray-300 font-semibold mb-1">Choose Color</label>
  <input
    type="color"
    value={coverDesign.primaryColor}
    onChange={(e) =>
      setCoverDesign({ ...coverDesign, primaryColor: e.target.value })
    }
    className="w-16 h-10 border border-gray-500 rounded"
  />
</div>
  <label className="block text-sm text-white">Text Content:</label>
  <input
    type="text"
    value={textBoxText}
    onChange={(e) => setTextBoxText(e.target.value)}
    className="w-full px-2 py-1 rounded bg-gray-800 border border-gray-600 text-white"
    placeholder="Enter your text..."
  />
<button
  onClick={() => setHasTextBox(true)}
  className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-1 px-3 rounded shadow mt-2"
>
Add to PDF
</button>

</div>

        </div>
      )}
    </div>

    {/* Box */}
    <div>
      <button
        className="bg-gray-800 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded shadow transition w-full text-left"
        onClick={() => setShowBoxOptions(prev => !prev)}
      >
         Add Box
      </button>
      {showBoxOptions && (
        <div className="bg-gray-700 p-4 mt-2 rounded shadow-inner">
          <div
  className="relative w-full h-full"
  onMouseMove={(e) => {
    const bounds = e.currentTarget.getBoundingClientRect();

    if (isDragging) {
      setTextBoxPosition({
        x: e.clientX - bounds.left - dragOffset.x,
        y: e.clientY - bounds.top - dragOffset.y,
      });
    }

    if (isResizing) {
      setTextBoxSize(prev => ({
        width: Math.max(40, e.clientX - bounds.left - textBoxPosition.x),
        height: Math.max(20, e.clientY - bounds.top - textBoxPosition.y),
      }));
    }
  }}
  onMouseUp={() => {
    setIsDragging(false);
    setIsResizing(false);
  }}
>


  {/* Draggable Text Box */}
  {textBoxText && (
    <div
      className="absolute bg-transparent text-black font-semibold cursor-move select-none"
      style={{
        left: textBoxPosition.x,
        top: textBoxPosition.y,
      }}
      onMouseDown={(e) => {
        const bounds = e.currentTarget.getBoundingClientRect();
        setIsDragging(true);
        setDragOffset({
          x: e.clientX - bounds.left,
          y: e.clientY - bounds.top,
        });
      }}
    >
      {textBoxText}
    </div>
  )}
</div>

        </div>
      )}
    </div>

    {/* Accented Box */}
    <div>
      <button
        className="bg-gray-800 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded shadow transition w-full text-left"
        onClick={() => setShowAccentBoxOptions(prev => !prev)}
      >
         Add Accented Box
      </button>
      {showAccentBoxOptions && (
        <div className="bg-gray-700 p-4 mt-2 rounded shadow-inner">
          {/* Placeholder for future accent box settings */}
        </div>
      )}
    </div>

  </div>
</div>






        <button
          onClick={handleContinue}
          className="bg-purple-600 hover:bg-purple-700 transition text-white font-semibold py-2 px-6 rounded-lg shadow"
        >
          Continue to Builder
        </button>
      </div>

      {/* Right Side: Live Preview */}
      <div className="w-full sm:w-1/2 flex justify-center items-start mt-10 sm:mt-0">
        <div className="bg-white w-[428px] h-[554px] p-4 rounded shadow-lg border border-gray-300">
          <div
  className="relative w-full h-full"
  onMouseMove={(e) => {
    if (isDragging) {
      const bounds = e.currentTarget.getBoundingClientRect();
      setTextBoxPosition({
        x: e.clientX - bounds.left - dragOffset.x,
        y: e.clientY - bounds.top - dragOffset.y,
      });
    }
  }}
  onMouseUp={() => setIsDragging(false)}
>
  {/* Draggable Text Box if added */}
  {hasTextBox && (
<div
  className="absolute bg-white text-black font-semibold cursor-move border-2 border-dashed border-gray-500 rounded px-2 py-1"
  style={{
    left: textBoxPosition.x,
    top: textBoxPosition.y,
    width: textBoxSize.width,
    height: textBoxSize.height,
    overflow: "hidden",
    resize: "none",
  }}
  onMouseDown={(e) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top,
    });
  }}
>
  <div className="w-full h-full flex items-center justify-center">
    {textBoxText}
  </div>

  {/* Resize handle */}
  <div
    className="absolute bottom-0 right-0 w-4 h-4 bg-gray-500 cursor-se-resize"
    onMouseDown={(e) => {
      e.stopPropagation();
      setIsResizing(true);
    }}
  />
</div>

  )}
</div>

        </div>
      </div>

    </div>
  );
};

export default DesignPage;
