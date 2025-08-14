import React from "react";
import { Link, useNavigate } from "react-router-dom";


const MobileHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="sm:hidden text-white py-2 px-4 shadow-md fixed w-full top-0 z-50"
      style={{
        background: "linear-gradient(to right, #5a4634, #7d6750, #5a4634)",
        boxShadow:
          "inset -2px 0 4px rgba(0,0,0,0.5), inset 2px 0 4px rgba(0,0,0,0.5)",
      }}
    >
      <div className="flex justify-between items-center">
        {/* Left Button */}
        <button
          onClick={() => navigate("/")}
          className="bg-black text-white px-3 py-1 rounded hover:bg-white hover:text-black text-xs"
        >
          Home
        </button>



      </div>
    </div>
  );
};

export default MobileHeader;
