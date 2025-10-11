import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

type ProfileData = {
  businessName?: string;
  tagline?: string;
  description?: string;
  location?: string;
  website?: string;
  contactEmail?: string;
  phone?: string;
  socialMedia?: { platform: string; url: string }[];
  images?: { url: string }[];
  userId?: string;
};

const ProfilePreviewPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "profilesDrafts", id); // collection for draft profiles
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setProfile(snap.data() as ProfileData);
        } else {
          console.warn("No profile found");
        }
      } catch (err) {
        console.error("❌ Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return <p className="p-6">Loading profile...</p>;
  if (!profile) return <p className="p-6">Profile not found.</p>;

  const isOwner = profile.userId === auth.currentUser?.uid;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg mt-6">
      {/* Header */}
      <div className="text-center border-b pb-4 mb-6">
        <h1 className="text-3xl font-bold">{profile.businessName}</h1>
        <p className="text-lg text-gray-600">{profile.tagline}</p>
      </div>

      {/* About */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">About</h2>
        <p className="text-gray-700">{profile.description}</p>
      </div>

      {/* Contact */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Contact</h2>
        <ul className="text-gray-700 space-y-1">
          {profile.location && <li><strong>Location:</strong> {profile.location}</li>}
          {profile.website && (
            <li>
              <strong>Website:</strong>{" "}
              <a href={profile.website} className="text-blue-600 underline" target="_blank" rel="noreferrer">
                {profile.website}
              </a>
            </li>
          )}
          {profile.contactEmail && <li><strong>Email:</strong> {profile.contactEmail}</li>}
          {profile.phone && <li><strong>Phone:</strong> {profile.phone}</li>}
        </ul>
      </div>

      {/* Social Media */}
      {profile.socialMedia && profile.socialMedia.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Social Media</h2>
          <ul className="space-y-1">
            {profile.socialMedia.map((sm, idx) => (
              <li key={idx}>
                <strong>{sm.platform}:</strong>{" "}
                <a href={sm.url} className="text-blue-600 underline" target="_blank" rel="noreferrer">
                  {sm.url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Images */}
      {profile.images && profile.images.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Gallery</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {profile.images.map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt={`Upload ${idx}`}
                className="w-full h-40 object-cover rounded border"
              />
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {isOwner && (
        <div className="flex justify-between mt-8">
          <button
            onClick={() => navigate("/profile-survey", { state: { editId: id } })}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Edit Profile
          </button>
          <button
            onClick={() => alert("Stripe payment coming soon!")}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Publish with Stripe
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePreviewPage;