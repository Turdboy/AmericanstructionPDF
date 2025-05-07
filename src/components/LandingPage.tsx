import React from "react";
import { useNavigate } from "react-router-dom";
import { VpaiLogo, landingPageImage } from "./images";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Desktop + tablet view */}
      <div className="hidden sm:block">
        {/* 🔲 Two-column Hero layout */}
        <div className="bg-black text-white">
          <div className="flex flex-row min-h-[calc(100vh-64px)] items-center">
            {/* Left Column */}
            <div className="w-1/2 flex flex-col justify-center items-center text-center p-8">
            <img
  src={VpaiLogo}
  alt="Vysix Logo"
  className="max-w-[250px] h-auto mb-4"
/>


              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-3">
                <span className="block">AI-Generated Competitive Bids</span>
                <span className="block">& High-Quality, Winning Proposals</span>
                <span className="block text-purple-400 mt-2">
                  with <span className="text-white">Vysix</span>
                </span>
              </h1>

              <p className="text-lg text-gray-400 max-w-md mb-8">
                Streamline estimating and turn insights into impactful deliverables.
              </p>

              <button
                onClick={() => navigate("/survey-proposal")}
                className="bg-purple-600 hover:bg-purple-700 transition text-white text-lg font-semibold py-3 px-6 rounded-lg shadow-md"
              >
                Demo our Technology
              </button>
            </div>

            {/* Right Column */}
            <div className="w-1/2 flex flex-col justify-center items-center text-center px-8">
  <p className="text-gray-300 text-lg max-w-md leading-tight mb-4">
    Vysix turns your data into beautiful, branded proposals — ready to share with clients in seconds.
  </p>

  <img
    src={landingPageImage}
    alt="Preview"
    className="rounded-lg shadow-lg max-w-[90%] h-auto mb-2"
  />
</div>

          </div>
        </div>

        {/* NEW SECTION */}
        <section className="bg-black text-white min-h-[calc(100vh-64px)] flex flex-col justify-center items-center px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Win More Contracts with AI-Generated Competitive Bids
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
              Vysix doesn’t just generate proposals — it crafts{" "}
              <span className="text-purple-400 font-semibold">winning bids</span>{" "}
              designed to outshine competitors, backed by smart pricing, client insights, and razor-sharp positioning.
            </p>
            <button
              onClick={() => navigate("/demo")}
              className="bg-purple-600 hover:bg-purple-700 transition text-white text-lg font-semibold py-3 px-6 rounded-lg shadow-md"
            >
              See How It Works
            </button>
          </div>
        </section>
      </div>

      {/* Mobile-only view */}
      <div className="sm:hidden bg-black text-white flex flex-col items-center text-center p-6 min-h-[calc(100vh-64px)]">
        <img src={VpaiLogo} alt="VPAI Logo" className="w-32 h-32 mb-4" />
        <h1 className="text-2xl font-bold mb-2">
          Win More Contracts <br /> with <span className="text-purple-400">Vysix</span>
        </h1>
        <p className="text-gray-400 text-sm max-w-xs mb-4">
          AI-crafted, competitive bids designed to outshine competitors and win you more contracts.
        </p>
        <button
          onClick={() => navigate("/survey-proposal")}
          className="bg-purple-600 hover:bg-purple-700 transition text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-md"
        >
          Demo our Tech
        </button>


         {/* NEW MOBILE BUTTONS */}
         <button
          onClick={() => navigate("/revisit")}
          className="bg-purple-500 hover:bg-purple-600 transition text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-md mb-2"
        >
          Revisit Inspection
        </button>

        <button
          onClick={() => navigate("/inspection")}
          className="bg-purple-500 hover:bg-purple-600 transition text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-md mb-2"
        >
          Start Inspection
        </button>

        <button
          onClick={() => navigate("/account")}
          className="bg-purple-500 hover:bg-purple-600 transition text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-md"
        >
          Account
        </button>


      </div>
    </>
  );
};

export default LandingPage;
