import React from "react";
import { useNavigate } from "react-router-dom";
import { VpaiLogo, landingPageImage } from "./images";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Desktop + tablet view */}
      <div className="hidden sm:block">
        <div className="bg-black text-white">
          <div className="flex flex-row min-h-[calc(100vh-64px)] items-center">
            <div className="w-1/2 flex flex-col justify-center items-center text-center p-8">
              <img
                src={VpaiLogo}
                alt="Vysix Logo"
                className="max-w-[250px] h-auto mb-4"
              />

          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-3">
  <span className="block"></span>

  <span className="block">
    Virtual Proposals <span className="text-purple-400">Made By AI </span>


  </span>
  <span className="text-white"> in seconds</span>
</h1>


              <p className="text-lg text-gray-400 max-w-md mb-8">
                AI Generated Bids designed for people to win service jobs against larger corporations.
              </p>

              <button
                onClick={() => navigate("/get-started")}
                className="bg-purple-600 hover:bg-purple-700 transition text-white text-lg font-semibold py-3 px-6 rounded-lg shadow-md"
              >
                Get Started
              </button>
            </div>

            <div className="w-1/2 flex flex-col justify-center items-center text-center px-8">
              <p className="text-gray-300 text-lg max-w-md leading-tight mb-4">
                Vpai turns your data into beautiful, branded proposals — ready to share with clients in seconds.
              </p>

              <img
                src={landingPageImage}
                alt="Preview"
                className="rounded-lg shadow-lg max-w-[90%] h-auto mb-2"
              />
            </div>
          </div>
        </div>

        <section className="bg-black text-white min-h-[calc(100vh-64px)] flex flex-col justify-center items-center px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Win More Contracts with AI-Generated Competitive Bids
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
              Vpai doesn’t just generate proposals — it crafts <span className="text-purple-400 font-semibold">winning bids</span> designed to outshine competitors, backed by smart pricing, client insights, and razor-sharp positioning.
            </p>
            <button
              onClick={() => navigate("/landingpagetvtracker")}
              className="bg-purple-600 hover:bg-purple-700 transition text-white text-lg font-semibold py-3 px-6 rounded-lg shadow-md"
            >
              See How It Works
            </button>
          </div>
        </section>
      </div>

      {/* Mobile-only view */}
      <div className="sm:hidden bg-black text-white flex flex-col items-center text-center px-6 py-8 min-h-screen">
        <img src={VpaiLogo} alt="VPAI Logo" className="w-32 h-32 mb-6" />

        <h1 className="text-2xl font-bold mb-4">
          Win More Contracts <br /> with <span className="text-purple-400">Vpai</span>
        </h1>

        <p className="text-gray-400 text-sm max-w-xs mb-6">
          AI-crafted, competitive bids designed to outshine competitors and win you more contracts.
        </p>

        <div className="flex flex-col space-y-3 w-full max-w-xs">
          <button
            onClick={() => navigate("/get-started")}
            className="bg-purple-600 hover:bg-purple-700 transition text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-md"
          >
            Get Started
          </button>

          <button
            onClick={() => navigate("/revisit")}
            className="bg-purple-500 hover:bg-purple-600 transition text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-md"
          >
            Revisit Inspection
          </button>

          <button
            onClick={() => navigate("/inspection")}
            className="bg-purple-500 hover:bg-purple-600 transition text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-md"
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
      </div>
    </>
  );
};

export default LandingPage;
