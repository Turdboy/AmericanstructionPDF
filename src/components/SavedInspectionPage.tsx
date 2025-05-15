import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

interface InspectionData {
  id: string;
  propertyName?: string;
  formData?: {
    propertyName?: string;
  };
  savedAt?: {
    seconds: number;
    nanoseconds: number;
  };
  [key: string]: any;
}

const SavedInspectionPage = () => {
  const [inspections, setInspections] = useState<InspectionData[]>([]);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ added search state
  const [draftInspection, setDraftInspection] = useState<InspectionData | null>(null);

  const navigate = useNavigate();
useEffect(() => {
  const fetchUserInspections = async () => {
    const user = auth.currentUser;
    if (!user) return alert("You must be logged in to see saved inspections.");

    try {
      // Fetch archive
      const archiveQ = query(
        collection(db, "inspectionsArchive"),
        where("userId", "==", user.uid),
        orderBy("savedAt", "desc")
      );
      const archiveSnap = await getDocs(archiveQ);
      const archiveData = archiveSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as InspectionData[];

      setInspections(archiveData);
      console.log("🕒 Saved timestamps:", archiveData.map(d => d.savedAt));


      // Fetch draft
      const draftSnap = await getDocs(
        query(
          collection(db, "inspectionsDrafts"),
          where("userId", "==", user.uid) // if saved by UID as doc ID, fetch by ID instead
        )
      );

      if (!draftSnap.empty) {
        const draftDoc = draftSnap.docs[0];
        setDraftInspection({
          id: draftDoc.id,
          ...draftDoc.data(),
        } as InspectionData);
      }

    } catch (error) {
      console.error("❌ Error fetching inspections:", error);
    }
  };

  fetchUserInspections();
}, []);


  const formatTimestamp = (savedAt: any) => {
    if (savedAt?.seconds) {
      return new Date(savedAt.seconds * 1000).toLocaleString();
    }
    return "";
  };

  // ✅ Filter inspections by search term
  const filteredInspections = inspections.filter((insp) => {
    const name = insp.propertyName || insp.formData?.propertyName || "";
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

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
{draftInspection && (
  <div className="mb-6 p-4 border rounded shadow bg-blue-50">
    <h2 className="text-lg font-bold mb-1">Resume In-Progress Draft</h2>
    <p className="text-gray-700 mb-2">
      {draftInspection.propertyName || draftInspection.formData?.propertyName || "Unnamed Property"}
    </p>
    <button
      onClick={() => navigate("/inspection/commercial", { state: { data: draftInspection } })}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Resume Draft
    </button>
  </div>
)}
{/* 🔻 Snapshot Archive Section */}
<h2 className="text-lg font-bold mt-6 mb-2">Saved Snapshots</h2>

{filteredInspections.length === 0 ? (
  <p className="text-gray-500">No saved snapshots found.</p>
) : (
  <ul className="space-y-4">
    {filteredInspections.map((insp) => (
      <li
        key={insp.id}
        className="p-4 border rounded shadow flex justify-between items-center"
      >
        <div>
          <p className="font-bold">
            {insp.propertyName || insp.formData?.propertyName || "Unnamed Property"}
          </p>
          <p className="text-gray-500 text-sm">
            {formatTimestamp(insp.savedAt)}
          </p>
        </div>
        <button
          onClick={() => navigate("/inspection/commercial", { state: { data: insp } })}
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
