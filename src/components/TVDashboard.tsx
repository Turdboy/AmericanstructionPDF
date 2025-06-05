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
      {/* Hero Banner */}
      <div className="relative w-full h-64 bg-gradient-to-r from-purple-800 via-black to-black flex items-center justify-center mb-12">
        <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">
          Welcome back, {user?.email?.split('@')[0]}.
        </h1>
      </div>

      {/* Section Title */}
      <h2 className="text-2xl font-bold mb-6 text-left">New from the Community</h2>

      {/* Review Feed - Horizontal Scroll */}
      {latestReviews.length > 0 ? (
        <div className="overflow-x-auto whitespace-nowrap pb-6">
          {latestReviews.map((review) => (
            <div
              key={review.id}
              className="inline-block bg-gray-900 rounded-lg shadow-md mr-4 p-4 w-64 align-top"
            >
              <img
                src={review.imageUrl || "https://via.placeholder.com/150x220?text=No+Image"}
                alt={review.showName}
                className="w-full h-40 object-cover rounded mb-2"
              />
              <h3 className="text-xl font-semibold mb-1">{review.showName}</h3>
              <p className="text-sm mb-1">
                Season {review.seasonNumber}, Episode {review.episodeNumber}
              </p>
              <p className="text-sm text-purple-400 mb-1">Rating: {review.rating}/10</p>
              <p className="text-sm italic text-gray-300">{review.review}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">No recent reviews found.</p>
      )}

      {/* Floating Log Button */}
      <div className="fixed top-6 right-6">
        <button
          onClick={() => navigate("/survey-proposal")}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full shadow-lg"
        >
          + Log TV
        </button>
      </div>
    </div>
  );
};

export default TVDashboardPage;
