import React, { useState } from "react";

const AIVideoFeedPage: React.FC = () => {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);

  const handleGenerateFeed = async () => {
    if (!userInput.trim()) return;

    setLoading(true);
    setVideos([]); // Clear previous results

    try {
      const response = await fetch("http://localhost:5173/api/generateFeed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInput }),
      });

      if (response.ok) {
        const data = await response.json();
        setVideos(data.videos || []);
      } else {
        console.error("Failed to generate feed");
      }
    } catch (error) {
      console.error("Error generating feed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 space-y-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-center text-[#002147]">
        AI-Generated Video Feed
      </h1>

      <input
        type="text"
        placeholder="Describe what you want to see..."
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        className="p-3 border border-gray-300 rounded w-full max-w-lg shadow"
      />

      <button
        onClick={handleGenerateFeed}
        disabled={loading}
        className={`${
          loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
        } text-white px-6 py-2 rounded transition`}
      >
        {loading ? "Generating..." : "Generate My Feed"}
      </button>

      {!loading && videos.length === 0 && (
        <p className="text-gray-500">Enter a description to generate your feed.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-6xl mt-8">
        {videos.map((video, index) => (
          <div key={index} className="bg-white rounded shadow p-4">
            <video
              src={video.url}
              controls
              className="w-full h-48 object-cover rounded"
            />
            <p className="mt-2 text-sm text-gray-700">{video.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIVideoFeedPage;
