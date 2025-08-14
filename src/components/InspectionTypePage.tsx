import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

const InspectionTypePage = () => {
  const navigate = useNavigate();
  const [myForms, setMyForms] = useState([]);

  useEffect(() => {
    const fetchUserForms = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "inspectionformsandbids"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      const forms = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMyForms(forms);
    };

    fetchUserForms();
  }, []);

  const handleSelect = (type) => {
    const user = auth.currentUser;
    if (type === "commercial") {
      if (!user) {
        alert("You must be logged in to start a Commercial Roofing inspection.");
        return navigate("/login");
      }
      return navigate("/inspection/commercial");
    }

    if (type === "residential") {
      return alert("Residential form coming soon!");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Americanstruction Inspection Forms:</h1>

      <div className="space-y-4">
        <button
          onClick={() => handleSelect("commercial")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded text-lg"
        >
          🏢 Commercial Roofing Inspection
        </button>

        <button
          onClick={() => handleSelect("residential")}
          className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded text-lg"
        >
          🏠 Residential Inspection (Coming Soon)
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">📁 My Inspection Forms</h2>
        <div className="space-y-2">
          {myForms.map((form) => (
            <div
              key={form.id}
onClick={() => navigate("/inspection/custom", { state: { form } })}
              className="bg-gray-100 hover:bg-gray-200 transition cursor-pointer rounded px-4 py-2"
            >
{form.coverDesign?.title || form.title || "Untitled Inspection"}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InspectionTypePage;
