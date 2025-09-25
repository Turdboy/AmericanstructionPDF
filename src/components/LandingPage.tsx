import React from "react";
import { useNavigate } from "react-router-dom";
import { VpaiLogo, jimflick, vpaiColorfulV, americanstructionMetallic } from "./images";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Desktop + Tablet */}
      <div className="hidden sm:block bg-white text-[#111111] min-h-screen">
        <div className="flex flex-row min-h-[calc(100vh-64px)] items-center">
          {/* Left Column */}
          <div className="w-1/2 flex flex-col justify-center items-center text-center p-8">
            <img
              src={VpaiLogo}
              alt="jjfly Logo"
              style={{ width: "180px", height: "auto" }}
              className="mb-6"
            />

            <h1 className="text-5xl font-bold mb-3 text-[#111111]">
              James Tyler Computing
            </h1>
            <h2 className="text-2xl font-bold mb-6 text-[#7C3AED]">My Portfolio:</h2>

            {/* Portfolio Projects */}
            <div className="flex flex-col gap-6 w-full max-w-lg">
              {/* Project One */}
              <div className="flex items-center rounded-lg p-4 shadow bg-gray-50">
                <img
                  src={americanstructionMetallic}
                  alt="Americanstruction"
                  className="w-20 h-20 object-contain mr-4"
                />
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-bold text-[#7C3AED]">
                    Americanstruction Digital Inspection Form Database
                  </h3>
                  <ul className="text-sm mt-2 text-[#111111] space-y-1 font-semibold">
                    <li>Real-time inspection data saving.</li>
                    <li>Cloud resume from any device.</li>
                    <li>Seamless image/PDF integration.</li>
                  </ul>
                </div>
                <button
                  onClick={() => navigate("/inspection")}
                  className="bg-[#111111] text-white px-4 py-2 rounded hover:bg-gray-800"
                >
                  Check it Out
                </button>
              </div>

              {/* Project Two */}
              <div className="flex items-center rounded-lg p-4 shadow bg-gray-50">
                <img
                  src={vpaiColorfulV}
                  alt="VPAI"
                  className="w-20 h-20 object-contain mr-4"
                />
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-bold text-[#7C3AED]">
                    VPAI Custom Proposal Builder
                  </h3>
                  <ul className="text-sm mt-2 text-[#111111] space-y-1 font-semibold">
                    <li>Custom-designed proposal templates.</li>
                    <li>Full branding & page control.</li>
                    <li>In-app client signing & add-ons.</li>
                  </ul>
                </div>
                <button
                  onClick={() => navigate("/design")}
                  className="bg-[#111111] text-white px-4 py-2 rounded hover:bg-gray-800"
                >
                  Check it Out
                </button>
              </div>
            </div>

            {/* GitHub Button */}
            <div className="mt-6">
              <button
                onClick={() => console.log("GitHub link here")}
                className="bg-[#111111] text-white px-6 py-2 rounded hover:bg-gray-800"
              >
                GitHub
              </button>
            </div>
          </div>

          {/* Right Column — Bio & Image */}
          <div className="w-1/2 flex flex-col justify-center items-center text-center px-8">
            <img
              src={jimflick}
              alt="James Tyler"
              className="rounded-lg shadow-lg w-full max-w-[220px] h-auto mb-6"
            />
            <h1 className="text-4xl md:text-5xl font-bold text-[#7C3AED] mb-4">
              James Tyler
            </h1>
            <p className="text-lg font-semibold text-[#111111] max-w-[500px] mb-4">
              Electrical Engineering Student at the University of Illinois Chicago.
            </p>
            <p className="text-base text-[#111111] max-w-[500px] leading-relaxed font-semibold">
              James currently heads development on Project VPAI, a joint venture
              between James Tyler Computing and Americanstruction. James is
              pursuing a career in in patent litegation.
            </p>
          </div>
        </div>
      </div>

{/* Mobile */}
<div className="sm:hidden bg-white text-[#111111] flex flex-col items-center text-center min-h-screen pt-16 px-6">
  {/* Logo & Title */}
  <img src={VpaiLogo} alt="jjfly Logo" className="w-40 h-auto mx-auto mb-6" />
  <h1 className="text-3xl font-bold mb-8 text-[#111111]">James Tyler Computing</h1>

  {/* Two-column layout */}
  <div className="flex justify-center gap-6 w-full max-w-2xl">
    {/* Left Column - Profile */}
    <div className="flex flex-col items-center w-1/2 px-2">
      <img
        src={jimflick}
        alt="James Tyler"
        className="rounded-lg shadow-lg w-24 h-24 object-cover mb-4"
      />
      <h2 className="text-base font-bold text-[#7C3AED] mb-2">James Tyler</h2>
      <p className="text-[12px] text-[#111111] font-semibold mb-3 leading-snug">
        Computer Engineering Student at the University of Illinois Chicago.
      </p>
      <p className="text-[11px] text-[#111111] font-semibold leading-relaxed">
        James currently heads development on Project VPAI, a joint venture between James Tyler Computing and Americanstruction. His vision is to expand Jaypex into a premier AI think tank, capable of funding a political action committee to promote his objectives.
      </p>
    </div>

    {/* Right Column - Portfolio */}
    <div className="flex flex-col items-center w-1/2 px-2">
      <h2 className="text-sm font-bold mb-4 text-[#7C3AED]">My Portfolio:</h2>

      {/* Project 1 */}
      <div className="flex flex-col items-center bg-gray-50 p-4 rounded-lg mb-5 shadow w-full">
        <img src={americanstructionMetallic} alt="Americanstruction" className="w-14 h-14 mb-3" />
        <h3 className="font-bold text-[13px] mb-2 text-center text-[#7C3AED]">
          Americanstruction Digital Inspection Form Database
        </h3>
        <p className="text-[11px] text-[#111111] font-semibold mb-3 text-center leading-snug">
          Real-time inspection data saving. Cloud resume from any device. Seamless image/PDF integration.
        </p>
        <button
          onClick={() => navigate("/inspection")}
          className="bg-[#111111] text-white text-[11px] px-3 py-1 rounded hover:bg-gray-800"
        >
          Check it Out
        </button>
      </div>

      {/* Project 2 */}
      <div className="flex flex-col items-center bg-gray-50 p-4 rounded-lg mb-5 shadow w-full">
        <img src={vpaiColorfulV} alt="VPAI" className="w-14 h-14 mb-3" />
        <h3 className="font-bold text-[13px] mb-2 text-center text-[#7C3AED]">
          VPAI Custom Proposal Builder
        </h3>
        <p className="text-[11px] text-[#111111] font-semibold mb-3 text-center leading-snug">
          Custom-designed proposal templates. Full branding & page control. In-app client signing & add-ons.
        </p>
        <button
          onClick={() => navigate("/design")}
          className="bg-[#111111] text-white text-[11px] px-3 py-1 rounded hover:bg-gray-800"
        >
          Check it Out
        </button>
      </div>

      {/* GitHub Button */}
      <button
        onClick={() => console.log("GitHub link here")}
        className="bg-[#111111] text-white text-[11px] px-4 py-2 rounded hover:bg-gray-800"
      >
        GitHub
      </button>
    </div>
  </div>
</div>






    </>
  );
};

export default LandingPage;
