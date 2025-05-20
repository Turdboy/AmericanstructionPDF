import React from "react";
import { Link } from "react-router-dom";

const MobileHeader: React.FC = () => {
  return (
    <div className="sm:hidden bg-gradient-to-r from-[#FBA504] to-[#E83286] text-white py-3 px-4 shadow-md fixed w-full top-0 z-50">
      <div className="flex justify-between items-center">
        <Link
          to="/"
          className="bg-black text-white px-4 py-2 rounded hover:bg-white hover:text-black transition text-sm"
        >
          Landing Page
        </Link>
      </div>
    </div>
  );
};

export default MobileHeader;
