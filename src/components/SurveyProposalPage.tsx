import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../../hooks/useAuth";

const TVTrackerPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    showName: "",
    seasonNumber: "",
    episodeNumber: "",
    episodeTitle: "",
    rating: "",
    review: "",
  });

  const [selectedShow, setSelectedShow] = useState<any>(null); // <== track full show object
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [randomShows, setRandomShows] = useState<any[]>([]);
  const [seasons, setSeasons] = useState<any[]>([]);
  const [episodes, setEpisodes] = useState<any[]>([]);

  useEffect(() => {
    const fetchRandomShows = async () => {
      try {
        const response = await fetch("https://api.tvmaze.com/shows?page=1");
        const data = await response.json();
        const shuffled = data.sort(() => 0.5 - Math.random());
        setRandomShows(shuffled.slice(0, 10));
      } catch (error) {
        console.error("Error fetching random shows:", error);
      }
    };
    fetchRandomShows();
  }, []);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    const fetchShows = async () => {
      try {
        const response = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Error fetching shows:", error);
      }
    };
    fetchShows();
  }, [searchQuery]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectShow = async (show: any) => {
    setSelectedShow(show);  // <== store full show object
    setFormData({ ...formData, showName: show.name, seasonNumber: "", episodeNumber: "" });
    try {
      const seasonsRes = await fetch(`https://api.tvmaze.com/shows/${show.id}/seasons`);
      const seasonsData = await seasonsRes.json();
      setSeasons(seasonsData);
    } catch (error) {
      console.error("Error fetching seasons:", error);
    }
  };

  const handleSeasonSelect = async (seasonId: string) => {
    setFormData({ ...formData, seasonNumber: seasonId, episodeNumber: "" });
    try {
      const episodesRes = await fetch(`https://api.tvmaze.com/seasons/${seasonId}/episodes`);
      const episodesData = await episodesRes.json();
      setEpisodes(episodesData);
    } catch (error) {
      console.error("Error fetching episodes:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, "tvReviews"), {
        userId: user.uid,
        showName: formData.showName,
        seasonNumber: formData.seasonNumber,
        episodeNumber: formData.episodeNumber,
        rating: formData.rating,
        review: formData.review,
        imageUrl: selectedShow?.image?.medium || "",  // <== ADD imageUrl here
        createdAt: serverTimestamp(),
      });
      alert("Review saved!");
      navigate("/tv-dashboard");
    } catch (error) {
      console.error("Error saving review:", error);
      alert("Failed to save review.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-black text-white w-full">
      {/* Random Shows */}
      {randomShows.length > 0 && (
        <div className="w-full max-w-4xl overflow-x-auto flex space-x-2 mb-6">
          {randomShows.map((show) => (
            <img
              key={show.id}
              src={show.image ? show.image.medium : "https://via.placeholder.com/80x120?text=No+Image"}
              alt={show.name}
              title={show.name}
              className="w-24 h-36 object-cover rounded cursor-pointer hover:scale-105 transition"
              onClick={() => handleSelectShow(show)}
            />
          ))}
        </div>
      )}

      <h1 className="text-3xl font-bold mb-4 text-center">TV Tracker Demo</h1>

      <input
        type="text"
        name="showName"
        placeholder="Search Show Name"
        value={formData.showName}
        onChange={(e) => {
          handleChange(e);
          setSearchQuery(e.target.value);
        }}
        className="p-2 border border-gray-300 rounded mb-2 w-full max-w-md text-black"
      />

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-4 max-w-md">
          {searchResults.map((result) => (
            <div
              key={result.show.id}
              className="cursor-pointer p-2 border rounded hover:bg-purple-100"
              onClick={() => handleSelectShow(result.show)}
            >
              <img
                src={result.show.image ? result.show.image.medium : "https://via.placeholder.com/210x295?text=No+Image"}
                alt={result.show.name}
                className="w-full h-32 object-cover rounded mb-1"
              />
              <p className="text-center text-sm font-semibold text-white">{result.show.name}</p>
            </div>
          ))}
        </div>
      )}

      {/* Season Dropdown */}
      {seasons.length > 0 && (
        <select
          name="seasonNumber"
          value={formData.seasonNumber}
          onChange={(e) => handleSeasonSelect(e.target.value)}
          className="p-2 border border-gray-300 rounded mb-2 w-full max-w-md text-black"
        >
          <option value="">Select Season</option>
          {seasons.map((season) => (
            <option key={season.id} value={season.id}>
              Season {season.number}
            </option>
          ))}
        </select>
      )}

      {/* Episode Dropdown */}
      {episodes.length > 0 && (
        <select
          name="episodeNumber"
          value={formData.episodeNumber}
          onChange={handleChange}
          className="p-2 border border-gray-300 rounded mb-2 w-full max-w-md text-black"
        >
          <option value="">Select Episode</option>
          {episodes.map((ep) => (
            <option key={ep.id} value={ep.number}>
              Episode {ep.number}: {ep.name}
            </option>
          ))}
        </select>
      )}

      <input
        type="number"
        name="rating"
        placeholder="Rating (1-10)"
        value={formData.rating}
        onChange={handleChange}
        className="p-2 border border-gray-300 rounded mb-2 w-full max-w-md text-black"
        min="1"
        max="10"
      />

      <textarea
        name="review"
        placeholder="Your Review"
        value={formData.review}
        onChange={handleChange}
        className="p-2 border border-gray-300 rounded mb-4 w-full max-w-md text-black"
        rows={4}
      />

      <button
        onClick={handleSubmit}
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded transition"
      >
        Save Review
      </button>
    </div>
  );
};

export default TVTrackerPage;
