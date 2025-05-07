import React, { useState } from "react";

const TVTrackerPage: React.FC = () => {
  const [formData, setFormData] = useState({
    showName: "",
    seasonNumber: "",
    episodeNumber: "",
    episodeTitle: "",
    rating: "",
    review: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    console.log("Tracked Episode:", formData);
    alert(`Saved your review for ${formData.showName}, S${formData.seasonNumber}E${formData.episodeNumber}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4 text-center">TV Tracker Demo</h1>

      <input
        type="text"
        name="showName"
        placeholder="Show Name"
        value={formData.showName}
        onChange={handleChange}
        className="p-2 border border-gray-300 rounded mb-2 w-full max-w-md"
      />

      <input
        type="text"
        name="seasonNumber"
        placeholder="Season Number"
        value={formData.seasonNumber}
        onChange={handleChange}
        className="p-2 border border-gray-300 rounded mb-2 w-full max-w-md"
      />

      <input
        type="text"
        name="episodeNumber"
        placeholder="Episode Number"
        value={formData.episodeNumber}
        onChange={handleChange}
        className="p-2 border border-gray-300 rounded mb-2 w-full max-w-md"
      />

      <input
        type="text"
        name="episodeTitle"
        placeholder="Episode Title"
        value={formData.episodeTitle}
        onChange={handleChange}
        className="p-2 border border-gray-300 rounded mb-2 w-full max-w-md"
      />

      <input
        type="number"
        name="rating"
        placeholder="Rating (1-10)"
        value={formData.rating}
        onChange={handleChange}
        className="p-2 border border-gray-300 rounded mb-2 w-full max-w-md"
        min="1"
        max="10"
      />

      <textarea
        name="review"
        placeholder="Your Review"
        value={formData.review}
        onChange={handleChange}
        className="p-2 border border-gray-300 rounded mb-4 w-full max-w-md"
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
