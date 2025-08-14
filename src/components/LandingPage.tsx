import React from "react";
import { useNavigate } from "react-router-dom";
import { VpaiLogo, jimflick, chicagoSkyline, vpaiColorfulV, americanstructionMetallic } from "./images";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Desktop + tablet view */}
      <div className="hidden sm:block">
        <div
          className="text-white"
          style={{
            backgroundImage: `url(${chicagoSkyline})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            minHeight: "100vh",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Dark gradient overlay */}
<div
  style={{
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.80)", // dims the skyline
    zIndex: 1
  }}
></div>


          {/* Gold pillars */}
          <div
            style={{
  position: "absolute",
  top: 0,
  bottom: 0,
  left: "31%", // adjust for each pillar position
  width: "100px", // wider like real beams
background: "linear-gradient(to right, #5a4634, #7d6750, #5a4634)",
boxShadow: "inset -2px 0 4px rgba(0,0,0,0.5), inset 2px 0 4px rgba(0,0,0,0.5)",

  opacity: 0.9,
  zIndex: 2
}
}
          ></div>
         
          <div
            style={{
  position: "absolute",
  top: 0,
  bottom: 0,
  left: "63%", // adjust for each pillar position
  width: "100px", // wider like real beams
background: "linear-gradient(to right, #5a4634, #7d6750, #5a4634)",
boxShadow: "inset -2px 0 4px rgba(0,0,0,0.5), inset 2px 0 4px rgba(0,0,0,0.5)",

  zIndex: 2
}
}
          ></div>


          {/* Left-edge pillar */}
<div
  style={{
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "-2%",          // adjust if you want it closer/farther from the edge
    width: "100px",
background: "linear-gradient(to right, #5a4634, #7d6750, #5a4634)",
boxShadow: "inset -2px 0 4px rgba(0,0,0,0.5), inset 2px 0 4px rgba(0,0,0,0.5)",

    opacity: 0.9,
    zIndex: 2
  }}
></div>

{/* Right-edge pillar */}
<div
  style={{
    position: "absolute",
    top: 0,
    bottom: 0,
    right: "-2%",         // use right for the far-right pillar so it doesn’t hang offscreen
    width: "100px",
background: "linear-gradient(to right, #5a4634, #7d6750, #5a4634)",
boxShadow: "inset -2px 0 4px rgba(0,0,0,0.5), inset 2px 0 4px rgba(0,0,0,0.5)",

    opacity: 0.9,
    zIndex: 2
  }}
></div>


          {/* Content wrapper */}
          <div style={{ position: "relative", zIndex: 3 }}>
            <div className="flex flex-row min-h-[calc(100vh-64px)] items-center">
              {/* Left Column */}
              <div className="w-1/2 flex flex-col justify-center items-center text-center p-8">
              <img
  src={VpaiLogo}
  alt="JC Logo"
  style={{ width: "180px", height: "auto" }} // ✅ fixed width for guaranteed bigger size
  className="mb-4"
/>


                <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-3">
                  <span className="block">James Tyler Computing</span>
           
                </h1>





                       <h2 className="text-2xl font-bold text-white mb-2">

                  My Portfolio:
                </h2>
                {/* Portfolio Projects */}
<div className="flex flex-col gap-6 mt-4">

  {/* Project One */}
<div className="flex items-center rounded-lg p-4">

    <img
      src={americanstructionMetallic}
      alt="Americanstruction Metallic Logo"
      className="w-20 h-20 object-contain mr-4"
    />
    <div className="flex-1 text-left">
      <h3 className="text-white font-bold text-lg mb-1">
  Americanstruction Digital 
</h3>
      <h3 className="text-white font-bold text-lg mb-1">
  Inspection Form Database
</h3>
      <ul className="text-sm text-gray-300 space-y-1">
        <li>Real-time inspection data saving.</li>
        <li>Cloud resume from any device.</li>
        <li>Seamless image/PDF integration.</li>
      </ul>
    </div>
    <button
      onClick={() => navigate("/inspection")} // <-- link for project one
      className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
    >
      Check it Out
    </button>
  </div>

  {/* Project Two */}
<div className="flex items-center rounded-lg p-4">

    <img
      src={vpaiColorfulV}
      alt="Colorful V Logo"
      className="w-20 h-20 object-contain mr-4"

    />
    <div className="flex-1 text-left">
      <h3 className="text-white font-bold text-lg mb-1">
  VPAI Custom Proposal Builder
</h3>
      <ul className="text-sm text-gray-300 space-y-1">
        <li>Custom-designed proposal templates.</li>
        <li>Full branding & page control.</li>
        <li>In-app client signing & add-ons.</li>
      </ul>
    </div>
    <button
      onClick={() => navigate("/design")} // <-- link for project two
      className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
    >
      Check it Out
    </button>
  </div>
</div>

{/* GitHub Button */}
<div className="mt-6">
  <button
    onClick={() => console.log("GitHub link here")} // <-- program later
    className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
  >
    GitHub
  </button>
</div>

              </div>

{/* Right Column — Bio & Image */}
<div className="w-1/2 flex flex-col justify-center items-center text-center px-8">
  <img
    src={jimflick}
    alt="James Tyler speaking at event"
    className="rounded-lg shadow-lg w-full max-w-[220px] h-auto mb-6"
  />

  <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
    James Tyler
  </h1>

  <p className="text-lg font-semibold text-white max-w-[500px] leading-relaxed mb-4">
    Computer Engineering Student at the University of Illinois Chicago.
  </p>

  <p className="text-base text-gray-100 max-w-[500px] leading-relaxed font-semibold">
    James currently heads development on Project VPAI, a joint venture between James Tyler Computing and Americanstruction.
     His vision is to expand Jaypex into a premier AI think tank, capable of funding a political action committee to promote his objectives.
  </p>
</div>


            </div>
          </div>
        </div>

        {/* Secondary Section */}
        <section className="bg-black text-white min-h-[calc(100vh-64px)] flex flex-col justify-center items-center px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Win More Contracts with AI-Generated Competitive Bids
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
              Vpai doesn’t just generate proposals — it crafts{" "}
              <span className="text-purple-400 font-semibold">winning bids</span>{" "}
              designed to outshine competitors, backed by smart pricing, client
              insights, and razor-sharp positioning.
            </p>
            <button
              onClick={() => navigate("/design")}
              className="bg-purple-600 hover:bg-purple-700 transition text-white text-lg font-semibold py-3 px-6 rounded-lg shadow-md"
            >
              See How It Works
            </button>
          </div>
        </section>
      </div>

{/* Mobile-only view */}
<div
  className="sm:hidden text-white flex flex-col items-center text-center min-h-screen relative pt-16"
  






  
  style={{
    backgroundImage: `url(${chicagoSkyline})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
  }}
>




  

  {/* Dark overlay */}
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.80)",
      zIndex: 1,
    }}
  ></div>

  {/* Gold pillars - narrowed for mobile */}
  {[
    { side: "left", value: "-2%" },
    { side: "left", value: "31%" },
    { side: "left", value: "63%" },
    { side: "right", value: "-2%" },
  ].map((pos, i) => (
    <div
      key={i}
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        [pos.side]: pos.value,
        width: "40px",
        background: "linear-gradient(to right, #5a4634, #7d6750, #5a4634)",
        boxShadow:
          "inset -2px 0 4px rgba(0,0,0,0.5), inset 2px 0 4px rgba(0,0,0,0.5)",
        opacity: 0.9,
        zIndex: 2,
      }}
    ></div>
  ))}

  {/* Foreground content */}
  <div style={{ position: "relative", zIndex: 3 }} className="px-3 py-6 w-full max-w-full">

{/* Logo & Title */}
<img src={VpaiLogo} alt="JC Logo" className="w-48 h-auto mx-auto mb-4" />
<h1 className="text-2xl font-bold mb-6">James Tyler Computing</h1>


    {/* Two-column layout */}
    <div className="flex justify-center gap-4">
      {/* Left Column - Profile */}

      <div className="flex flex-col items-center w-[45%]">
        
        <img
          src={jimflick}
          alt="James Tyler"
          className="rounded-lg shadow-lg w-20 h-20 object-cover mb-2"
        />
        <h2 className="text-base font-bold mb-1">James Tyler</h2>
        <p className="text-[10px] text-gray-300 mb-1">
          Computer Engineering Student at the University of Illinois Chicago.
        </p>
        <p className="text-[9px] text-gray-300 leading-snug">
          James currently heads development on Project VPAI, a joint venture between James Tyler Computing and Americanstruction. His vision is to expand Jaypex into a premier AI think tank, capable of funding a political action committee to promote his objectives.
        </p>
      </div>

      {/* Right Column - Portfolio */}
      <div className="flex flex-col items-center w-[45%]">
        <h2 className="text-sm font-bold mb-2">My Portfolio:</h2>

        {/* Project 1 */}
        <div className="flex flex-col items-center bg-black/40 p-2 rounded-lg mb-3">
          <img src={americanstructionMetallic} alt="Americanstruction" className="w-12 h-12 mb-1" />
          <h3 className="font-bold text-[11px] mb-1 text-center">Americanstruction Digital Inspection Form Database</h3>
          <p className="text-[9px] text-gray-300 mb-2 text-center">
            Real-time inspection data saving. Cloud resume from any device. Seamless image/PDF integration.
          </p>
          <button
            onClick={() => navigate("/inspection")}
            className="bg-black text-white text-[10px] px-2 py-1 rounded hover:bg-gray-800"
          >
            Check it Out
          </button>
        </div>

        {/* Project 2 */}
        <div className="flex flex-col items-center bg-black/40 p-2 rounded-lg mb-3">
          <img src={vpaiColorfulV} alt="VPAI" className="w-12 h-12 mb-1" />
          <h3 className="font-bold text-[11px] mb-1 text-center">VPAI Custom Proposal Builder</h3>
          <p className="text-[9px] text-gray-300 mb-2 text-center">
            Custom-designed proposal templates. Full branding & page control. In-app client signing & add-ons.
          </p>
          <button
            onClick={() => navigate("/design")}
            className="bg-black text-white text-[10px] px-2 py-1 rounded hover:bg-gray-800"
          >
            Check it Out
          </button>
        </div>

        {/* GitHub Button */}
        <button
          onClick={() => console.log("GitHub link here")}
          className="bg-black text-white text-[10px] px-3 py-1 rounded hover:bg-gray-800"
        >
          GitHub
        </button>
      </div>
    </div>

    {/* Call to Action */}
    <h1 className="text-sm font-bold mt-6 mb-2">
      Get Started <br />{" "}
      <span className="text-purple-400">Right Here:</span>
    </h1>


    {/* Buttons */}
    <div className="flex flex-col space-y-2 w-full max-w-[200px] mx-auto">
      
      <button onClick={() => navigate("/revisit")} className="bg-purple-500 hover:bg-purple-600 transition text-white text-[10px] font-semibold py-1 px-2 rounded-lg shadow-md">Revisit Inspection</button>
      <button onClick={() => navigate("/inspection")} className="bg-purple-500 hover:bg-purple-600 transition text-white text-[10px] font-semibold py-1 px-2 rounded-lg shadow-md">Start Inspection</button>
      <button onClick={() => navigate("/account")} className="bg-purple-500 hover:bg-purple-600 transition text-white text-[10px] font-semibold py-1 px-2 rounded-lg shadow-md">Account</button>
    </div>
  </div>
</div>




    </>
  );
};

export default LandingPage;
