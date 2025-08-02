import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore"; // you already have this

interface InspectionData {
  id: string;
  propertyName?: string;
  formData?: {
    propertyName?: string;
  };
  timestamp?: {
    seconds: number;
    nanoseconds: number;
  };
  [key: string]: any;
}

const SavedInspectionPage = () => {
const [drafts, setDrafts] = useState<InspectionData[]>([]);
const [latestDraft, setLatestDraft] = useState<InspectionData | null>(null);
const [searchTerm, setSearchTerm] = useState("");


  const navigate = useNavigate();useEffect(() => {
  const fetchDrafts = async () => {
    const user = auth.currentUser;
    if (!user) return alert("You must be logged in to see saved inspections.");

    try {
      const q = query(
        collection(db, "inspectionsDrafts"),
        where("userId", "==", user.uid),
        orderBy("timestamp", "desc")
      );
      const snap = await getDocs(q);
      const allDrafts = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as InspectionData[];

      // Get most recent
      const mostRecent = allDrafts[0] || null;

      // Deduplicate by property name
      const seen = new Set();
      const uniqueDrafts = allDrafts.filter(d => {
        const name = d.propertyName || d.formData?.propertyName || "Unnamed";
        if (seen.has(name)) return false;
        seen.add(name);
        return true;
      });

      setLatestDraft(mostRecent);
      setDrafts(uniqueDrafts);

    } catch (error) {
      console.error("❌ Error fetching drafts:", error);
    }
  };

  fetchDrafts();
}, []);



  const formatTimestamp = (timestamp: any) => {
    if (timestamp?.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleString();
    }
    return "";
  };



  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Revisit Saved Inspections</h1>

      {/* ✅ Search bar at the top */}
      <input
        type="text"
        placeholder="Search by property name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 w-full border rounded"
      />

      {/* 🔵 Resume Draft Section */}
{latestDraft && (
  <div className="mb-6 p-4 border rounded shadow bg-blue-50">
    <h2 className="text-lg font-bold mb-1">Resume In-Progress Draft</h2>
    <p className="text-gray-700 mb-2">
      {latestDraft.propertyName || latestDraft.formData?.propertyName || "Unnamed Property"}
    </p>
    <button
      onClick={async () => {
  const docRef = doc(db, "inspectionsDrafts", doc.id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    console.log("✅ Loaded inspection from resume:", data);

    // ✅ Confirm optionalAddOns are loaded
    console.log("📦 optionalAddOns loaded:", data.formData?.optionalAddOns);

    navigate("/inspection/commercial", {
      state: { data },
    });
  } else {
    console.error("⚠️ No document found for ID:", doc.id);
  }
}}

      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Resume Draft
    </button>
  </div>
)}

{/* 🔻 Saved Drafts Section (from inspectionsDrafts) */}
<h2 className="text-lg font-bold mt-6 mb-2">Saved Drafts</h2>

{drafts.length === 0 ? (
  <p className="text-gray-500">No saved drafts found.</p>
) : (
  <ul className="space-y-4">
    {drafts.map((draft) => (
      <li
        key={draft.id}
        className="p-4 border rounded shadow flex justify-between items-center"
      >
        <div>
          <p className="font-bold">
            {draft.propertyName || draft.formData?.propertyName || "Unnamed Property"}
          </p>
          <p className="text-gray-500 text-sm">
            {formatTimestamp(draft.timestamp)}
          </p>
        </div>
        <button
          onClick={() => navigate("/inspection/commercial", { state: { data: draft } })}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Open Snapshot
        </button>
      </li>
    ))}
  </ul>
)}



    </div>
  );
};

export default SavedInspectionPage;
