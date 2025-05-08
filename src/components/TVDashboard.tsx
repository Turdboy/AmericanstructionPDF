import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { useAuth } from "../../hooks/useAuth";

const TVDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [latestReview, setLatestReview] = useState<any>(null);

  useEffect(() => {
    const fetchLatestReview = async () => {
      if (!user) return;

      try {
        const q = query(
          collection(db, "tvReviews"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc"),
          limit(1)
        );
        const querySnapshot = await getDocs(q);
        const reviews = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (reviews.length > 0) {
          setLatestReview(reviews[0]);
        }
      } catch (error) {
        console.error("Error fetching latest review:", error);
      }
    };

    fetchLatestReview();
  }, [user]);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">TV Tracker Dashboard</h1>

      {user && (
        <div className="mb-8 text-center">
          <p className="text-lg">Logged in as: <span className="font-semibold">{user.email}</span></p>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>

        {latestReview ? (
          <div className="bg-gray-800 p-4 rounded shadow-md max-w-md mx-auto">
            <h3 className="text-xl font-semibold mb-2">{latestReview.showName}</h3>
            <p className="mb-1">Season: {latestReview.seasonNumber}</p>
            <p className="mb-1">Episode: {latestReview.episodeNumber}</p>
            <p className="mb-1">Rating: {latestReview.rating}/10</p>
            <p className="mb-1">Review: {latestReview.review}</p>
          </div>
        ) : (
          <p className="text-center">No recent reviews found.</p>
        )}
      </div>
    </div>
  );
};

export default TVDashboardPage;
