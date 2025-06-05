import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";


const VysixProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();


  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      {/* Profile Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 rounded-full bg-gray-700" />
          <div>
            <h1 className="text-3xl font-bold">
              {user?.email?.split("@")[0] || "User"}
            </h1>
            <div className="flex space-x-4 text-sm mt-2 text-gray-400">
              <span>🎬 0 watched</span>
              <span>⭐ 0 followers</span>
              <span>📝 0 reviews</span>
            </div>
          </div>
        </div>
        <button
  onClick={() => navigate("/vysix/profile/edit")}
  className="px-4 py-2 bg-purple-700 hover:bg-purple-800 rounded"
>
  Edit Profile
</button>

      </div>

      {/* Favorite Shows */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Favorite Shows</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-800 rounded shadow p-2 text-center"
            >
              <div className="h-48 bg-gray-700 rounded mb-2" />
              <p className="text-sm text-gray-300">Show Title {i + 1}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-800 min-w-[150px] p-2 rounded shadow"
            >
              <div className="h-40 bg-gray-700 rounded mb-2" />
              <div className="text-sm text-gray-300">
                <p>Rating: ⭐⭐⭐</p>
                <p className="italic text-xs">Review goes here</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default VysixProfilePage;
