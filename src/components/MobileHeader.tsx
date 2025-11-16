import React from "react";
import { useNavigate } from "react-router-dom";

const MobileHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="sm:hidden text-white py-3 px-4 fixed w-full top-0 z-50"
      style={{
        background: "#FFFFFF", // <-- changed from gold to pure white
        borderBottom: "4px solid black", // keep the black underline
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      }}
    >
      <div className="flex justify-between items-center">

        {/* Left Group */}
        <div className="flex space-x-2">
          <button
            onClick={() => navigate("/")}
            className="bg-black text-white px-3 py-1 rounded text-xs hover:bg-white hover:text-black"
          >
            Home
          </button>

          <button
            onClick={() => navigate("/revisit")}
            className="bg-black text-white px-3 py-1 rounded text-xs hover:bg-white hover:text-black"
          >
            Revisit Inspections
          </button>

          <button
            onClick={() => navigate("/inspection")}
            className="bg-black text-white px-3 py-1 rounded text-xs hover:bg-white hover:text-black"
          >
            Start Inspection
          </button>
        </div>

        {/* Right Side */}
        <button
          onClick={() => navigate("/account")}
          className="bg-black text-white px-3 py-1 rounded text-xs hover:bg-white hover:text-black"
        >
          Account
        </button>
      </div>
    </div>
  );
};

export default MobileHeader;
