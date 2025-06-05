import React from "react";

const AboutMeJamesTyler: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-16 font-mono">
      <div className="max-w-4xl mx-auto flex flex-col space-y-10">
        <h1 className="text-4xl font-bold tracking-wide text-center text-gray-100">
          JAMES TYLER
        </h1>
        <div className="flex flex-col md:flex-row md:space-x-10 items-start">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-300 mb-4">PROFILE</h2>
            <p className="text-gray-400 mb-4 leading-relaxed">
                James Tyler is a computer engineering student at the university of illinois chicago.
            </p>
            <p className="text-gray-400 mb-4 leading-relaxed">
              James is studying for a career in patent law. James serves as a lead developer and consultant for Americanstruction, where he designed a cutting-edge AI estimating tool that reduced commercial roofing turnaround times and helped the company expand into new markets. James combines a strong engineering background with real-world software innovation, bringing a unique edge to the future of IP law.
            </p>
            <p className="text-gray-400 mb-4 leading-relaxed">

            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMeJamesTyler;
