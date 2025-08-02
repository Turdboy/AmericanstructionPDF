import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { VpaiLogo } from "./images";

const LandingPageTVTracker: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [randomShows, setRandomShows] = useState<any[]>([]);

  useEffect(() => {
    const fetchRandomShows = async () => {
      try {
        const response = await fetch("https://api.tvmaze.com/shows?page=1");
        const data = await response.json();
        const shuffled = data.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 10);
        setRandomShows(selected);
      } catch (error) {
        console.error("Error fetching random shows:", error);
      }
    };

    fetchRandomShows();
  }, []);

  const handleGetStarted = () => {
    if (!user) {
      alert("You must be logged in to continue.");
      navigate("/login");
    } else {
      navigate("/tv-dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 w-full">
      <img src={VpaiLogo} alt="Vysix Logo" className="w-32 h-32 mb-6" />

      {/* 🔥 Scrollable random/popular shows menu */}
      {randomShows.length > 0 && (
        <div className="w-full max-w-4xl overflow-x-auto flex space-x-2 mb-6">
          {randomShows.map((show) => (
            <img
              key={show.id}
              src={show.image ? show.image.medium : "https://via.placeholder.com/80x120?text=No+Image"}
              alt={show.name}
              title={show.name}
              className="w-24 h-36 object-cover rounded hover:scale-105 transition"
            />
          ))}
        </div>
      )}

      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
        Bingable
      </h1>

      <p className="text-lg text-gray-300 max-w-xl text-center mb-8">
        Track, review, and explore your favorite shows — built for TV fans.
      </p>

      <button
        onClick={handleGetStarted}
        className="bg-purple-600 hover:bg-purple-700 transition text-white text-lg font-semibold py-3 px-6 rounded-lg shadow-md"
      >
        Get Started — It’s Free
      </button>
    </div>
  );
};

export default LandingPageTVTracker;