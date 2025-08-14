import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";  // adjust path if needed
import { clearSavedInspectionDraft } from "../services/inspectionService";  // adjust path if needed

const StartInspectionButton: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleClick = async () => {
    if (user) {
      try {
        await clearSavedInspectionDraft(user.uid);
        console.log("✅ Cleared old inspection draft");
      } catch (err) {
        console.error("❌ Failed to clear draft:", err);
      }
    }
    navigate("/inspection");
  };

  return (
    <button
      className="bg-black text-white px-4 py-2 rounded hover:bg-white hover:text-black transition"
      onClick={handleClick}
    >
      Start Inspection
    </button>
  );
};

export default StartInspectionButton;
