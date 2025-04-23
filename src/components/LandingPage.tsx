import React from "react";
import { useNavigate } from "react-router-dom";
import { VpaiLogo, landingPageImage } from "./images";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* 🔲 Two-column Hero layout (height only applied here) */}
      <div className="bg-black text-white">
  <div className="flex flex-row min-h-[calc(100vh-64px)] items-center">
    {/* Left Column */}
    <div className="w-1/2 flex flex-col justify-center items-center text-center p-8 -mt-40">
      <img src={VpaiLogo} alt="VPAI Logo" className="w-80 h-80 mb-0" />

      <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-3">
        <span className="block">Organize your content into</span>
        <span className="block">high-quality, winning proposals</span>
        <span className="block text-purple-400 mt-2">
          with <span className="text-white">VPAI</span>
        </span>
      </h1>

      <p className="text-lg text-gray-400 max-w-md mb-8">
        streamline estimating and turn insights into impactful deliverables.
      </p>

      <button
        onClick={() => navigate("/inspection")}
        className="bg-purple-600 hover:bg-purple-700 transition text-white text-lg font-semibold py-3 px-6 rounded-lg shadow-md"
      >
        Book a demo
      </button>
    </div>

{/* Right Column */}
<div className="w-1/2 flex flex-col items-center text-center px-8 pt-32">
  <p className="text-gray-300 text-lg max-w-md leading-tight mb-4">
    VPAI turns your data into beautiful, branded proposals — ready to share with clients in seconds.
  </p>

  <img
    src={landingPageImage}
    alt="Preview"
    className="rounded-lg shadow-lg max-w-[90%] mb-2"
  />


</div>



  </div>
</div>



    </>
  );
};

export default LandingPage;
