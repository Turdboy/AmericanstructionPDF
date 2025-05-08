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
  timestamp?: {
    seconds: number;
    nanoseconds: number;
  };
  [key: string]: any;
}

const SavedInspectionPage = () => {
  const [inspections, setInspections] = useState<InspectionData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInspections = async () => {
      const user = auth.currentUser;
      if (!user) return alert("You must be logged in to see saved inspections.");

      const q = query(
        collection(db, "inspectionsArchive"),
        where("userId", "==", user.uid),
        orderBy("savedAt", "desc")
    );
    
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as InspectionData[];
      setInspections(data);
    };

    fetchUserInspections();
  }, []);

  const handleResume = (inspection: InspectionData) => {
    navigate("/inspection/commercial", { state: { data: inspection } });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Revisit Saved Inspections</h1>
      {inspections.length === 0 ? (
        <p>No saved inspections found.</p>
      ) : (
        <ul className="space-y-4">
          {inspections.map((insp) => (
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
                  {insp.timestamp?.seconds
                    ? new Date(insp.timestamp.seconds * 1000).toLocaleString()
                    : "Unknown time"}
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
