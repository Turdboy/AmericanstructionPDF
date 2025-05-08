import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { useAuth } from "../../hooks/useAuth";

const TVDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [latestReviews, setLatestReviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchLatestReviews = async () => {
      if (!user) return;

      try {
        const q = query(
          collection(db, "tvReviews"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        const reviews = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLatestReviews(reviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchLatestReviews();
  }, [user]);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">TV Tracker Dashboard</h1>

      {user && (
        <div className="mb-8 text-center">
          <p className="text-lg">
            Logged in as: <span className="font-semibold">{user.email}</span>
          </p>
          <button
            onClick={() => navigate("/survey-proposal")}
            className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition"
          >
            Write a New Review
          </button>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>

        {latestReviews.length > 0 ? (
          <div className="grid gap-6 max-w-4xl mx-auto">
            {latestReviews.map((review) => (
              <div
                key={review.id}
                className="bg-gray-800 rounded-lg shadow-lg flex items-center space-x-6 p-6"
              >
                <img
                  src={review.imageUrl || "https://via.placeholder.com/150x220?text=No+Image"}
                  alt={review.showName}
                  className="w-32 h-48 object-cover rounded"
                />
                <div>
                  <h3 className="text-2xl font-bold mb-2">{review.showName}</h3>
                  <p className="text-sm mb-1">
                    Season: <span className="font-medium">{review.seasonNumber}</span>
                  </p>
                  <p className="text-sm mb-1">
                    Episode: <span className="font-medium">{review.episodeNumber}</span>
                  </p>
                  <p className="text-sm mb-1">
                    Rating: <span className="font-medium">{review.rating}/10</span>
                  </p>
                  <p className="text-sm">
                    Review: <span className="italic">{review.review}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">No recent reviews found.</p>
        )}
      </div>
    </div>
  );
};

export default TVDashboardPage;
