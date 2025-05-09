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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInspections = async () => {
      const user = auth.currentUser;
      if (!user) return alert("You must be logged in to see saved inspections.");

      try {
        const q = query(
          collection(db, "inspectionsArchive"), // or inspectionsDrafts if you switched
          where("userId", "==", user.uid),
          orderBy("savedAt", "desc")
        );

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as InspectionData[];

        setInspections(data);
      } catch (error) {
        console.error("❌ Error fetching inspections:", error);
      }
    };

    fetchUserInspections();
  }, []);

  const handleResume = (inspection: InspectionData) => {
    navigate("/inspection/commercial", { state: { data: inspection } });
  };

  const formatTimestamp = (savedAt: any) => {
    if (savedAt?.seconds) {
      return new Date(savedAt.seconds * 1000).toLocaleString();
    }
    return "Unknown time";
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

      {filteredInspections.length === 0 ? (
        <p>No saved inspections found.</p>
      ) : (
        <ul className="space-y-4">
          {filteredInspections.map((insp) => (
            <li
              key={insp.id}
              className="p-4 border rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="font-bold">
                  {insp.propertyName ||
                   insp.formData?.propertyName ||
                   "Unnamed Property"}
                </p>
                <p className="text-gray-500 text-sm">
                  {formatTimestamp(insp.savedAt)}
                </p>
              </div>
              <button
                onClick={() => handleResume(insp)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Resume
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SavedInspectionPage;
