import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const SavedInspectionPage = () => {
  const [inspections, setInspections] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInspections = async () => {
      const q = query(collection(db, "inspections"), orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setInspections(data);
    };

    fetchInspections();
  }, []);

  const handleResume = (inspection) => {
    navigate("/inspection", { state: { data: inspection } });

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
                <p className="font-bold">{insp.propertyName || "Unnamed Property"}</p>
                <p className="text-gray-500 text-sm">{new Date(insp.timestamp?.seconds * 1000).toLocaleString()}</p>
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
