// src/components/VysixEditProfilePage.tsx
import React, { useState } from "react";

const VysixEditProfilePage: React.FC = () => {
  const [favorites, setFavorites] = useState(["", "", "", ""]);
  const [recentReviews, setRecentReviews] = useState(["", "", "", "", ""]);

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Your Profile</h1>

      {/* 🟣 Favorite Shows */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-2">Favorite Shows</h2>
        {favorites.map((title, i) => (
          <input
            key={i}
            value={title}
            onChange={(e) => {
              const updated = [...favorites];
              updated[i] = e.target.value;
              setFavorites(updated);
            }}
            placeholder={`Show Title ${i + 1}`}
            className="mb-2 w-full p-2 rounded bg-gray-800 text-white placeholder-gray-500"
          />
        ))}
      </section>

      {/* 📝 Recent Activity */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Recent Activity Reviews</h2>
        {recentReviews.map((review, i) => (
          <textarea
            key={i}
            value={review}
            onChange={(e) => {
              const updated = [...recentReviews];
              updated[i] = e.target.value;
              setRecentReviews(updated);
            }}
            placeholder={`Review for Show ${i + 1}`}
            className="mb-2 w-full p-2 rounded bg-gray-800 text-white placeholder-gray-500"
          />
        ))}
      </section>

      <button className="mt-6 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded">
        Save Changes
      </button>
    </div>
  );
};

export default VysixEditProfilePage;
