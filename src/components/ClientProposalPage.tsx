import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { doc, getDocs, query, collection, where, orderBy, limit, updateDoc } from "firebase/firestore";
import { generatePDF } from "../utils/pdfGenerator";


const ClientProposalPage: React.FC = () => {
  const [formData, setFormData] = useState<any>({});
  const [clientEmailInput, setClientEmailInput] = useState("");
  const [inspectorEmailInput, setInspectorEmailInput] = useState("");
  const [clientName, setClientName] = useState("");
  const [inspectorName, setInspectorName] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [clientConfirmed, setClientConfirmed] = useState(false);
  const [clientSignature, setClientSignature] = useState("");
  const [clientInitials, setClientInitials] = useState("");
  const [inspectorSignature, setInspectorSignature] = useState("");
  const [inspectorInitials, setInspectorInitials] = useState("");
  const [optionalAddOns, setOptionalAddOns] = useState<any[]>([]);
  const [confirmationChecked, setConfirmationChecked] = useState(false);
  const [docId, setDocId] = useState<string | null>(null);

const [finalEstimate, setFinalEstimate] = useState(null);
const [propertyName, setPropertyName] = useState("Loading...");

  const navigate = useNavigate();

  const getInitials = (name: string) => {
    const words = name.trim().split(" ");
    return words.length === 1 ? words[0][0] : (words[0][0] + words[1][0]).toUpperCase();
  };

useEffect(() => {
  const fetchLatestInspection = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const q = query(
        collection(db, "inspectionsDrafts"),
        where("userId", "==", user.uid),
        orderBy("savedAt", "desc"),
        limit(1)
      );

      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const data = doc.data();

        setFormData(data.formData || {});
        setClientEmailInput(data.formData?.clientcontactinfo || "");
setInspectorEmailInput(data.formData?.inspectorcontactinfo || "");

        setOptionalAddOns(data.optionalAddOns || []);
        setFinalEstimate(data.finalEstimate || null);
        setPropertyName(data.formData?.propertyName || "Unnamed Property");
      } else {
        console.warn("No draft found.");
      }
    } catch (err) {
      console.error("Error loading latest inspection draft:", err);
    }
  };

  fetchLatestInspection();
}, []);


  const toggleSelection = (i: number) => {
    setSelected(prev => prev.includes(i) ? prev.filter(n => n !== i) : [...prev, i]);
  };

  const saveClientSelection = async () => {
    if (!docId) return;

    const selectedAddOns = selected.map(i => optionalAddOns[i]);

    const confirmationData = {
      hasAgreedToTerms: true,
      fullName: clientName,
      initials: getInitials(clientName),
      signature: clientName,
      selectedAddOns,
    };

    const draftRef = doc(db, "inspectionsDrafts", docId);
    await updateDoc(draftRef, { clientConfirmation: confirmationData });
    console.log("✅ Saved client confirmation");
  };

  const handleClientSubmit = async () => {
    if (!clientName.trim() || selected.length === 0) {
      alert("Client must enter name and select at least one add-on.");
      return;
    }
    setClientConfirmed(true);
    await saveClientSelection();
  };

  const handleInspectorSubmit = () => {
    if (!inspectorName.trim()) {
      alert("Inspector must enter name.");
      return;
    }
    console.log("📝 Inspector Signature:", inspectorName);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-10">
      <button
        onClick={() => navigate("/revisit")}
        className="text-blue-600 underline mb-6"
      >
        ← Back
      </button>



      <div className="border p-4 mt-4 rounded">
  <h2 className="text-xl font-bold">{propertyName}</h2>


  {optionalAddOns.length > 0 && (
    <div className="mt-2">
      <h4 className="font-semibold">Optional Add-Ons:</h4>
      <ul className="list-disc list-inside">
        {optionalAddOns.map((addon, i) => (
          <li key={i}>{addon.label} – ${addon.price}</li>
        ))}
      </ul>
    </div>
  )}
</div>


      {/* CLIENT SECTION */}
      <div className="p-6 border rounded shadow bg-white">
        <h2 className="text-xl font-bold mb-2">Client Section</h2>
        {clientEmailInput && (
          <p className="text-sm text-gray-600 mb-2">
            Client Email: <strong>{clientEmailInput}</strong>
          </p>
        )}
        {!clientConfirmed ? (
          <>
            <input
              type="text"
              placeholder="Client Full Name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="border px-3 py-2 rounded w-full mb-4"
            />
            <div className="mb-4 space-y-2">
              <button
                onClick={() => {
                  setClientSignature(clientName);
                  setClientInitials(getInitials(clientName));
                }}
                className="bg-gray-200 text-sm px-3 py-1 rounded"
              >
                Generate Signature & Initials
              </button>
              <label className="flex items-start gap-2 text-sm mt-4">
                <input
                  type="checkbox"
                  checked={confirmationChecked}
                  onChange={(e) => setConfirmationChecked(e.target.checked)}
                  className="mt-1"
                />
                <span>
                  My <strong>signature</strong> will appear on the Signature page.
                  My <strong>initials</strong> will appear on the Scope of Work, Terms and Conditions, and Contract pages.
                </span>
              </label>
              <div className="mt-2 font-signature italic text-xl text-gray-700">
                {clientSignature && <>✒️ {clientSignature}</>}
              </div>
              <div className="mt-1 font-signature text-md text-gray-500">
                {clientInitials && <>🖋️ Initials: {clientInitials}</>}
              </div>
            </div>

            {optionalAddOns.length > 0 && (
              <>
                <h3 className="font-semibold mb-2">Pricing Options:</h3>
                {optionalAddOns.map((addon, i) => (
                  <label key={i} className="block mb-2">
                    <input
                      type="checkbox"
                      checked={selected.includes(i)}
                      onChange={() => toggleSelection(i)}
                      className="mr-2"
                    />
                    {addon.title} - ${addon.price}
                  </label>
                ))}
              </>
            )}

            <button
              onClick={handleClientSubmit}
              className={`mt-4 px-6 py-2 rounded text-white ${
                clientSignature && confirmationChecked && selected.length > 0
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!clientSignature || !confirmationChecked || selected.length === 0}
            >
              Confirm Pricing Options and Proceed
            </button>
          </>
        ) : (
          <div className="text-green-700 font-semibold mt-4">
            ✅ {clientName} has selected add-ons and confirmed.
            <p className="mt-2 text-sm italic">
              By signing below, client agrees to the contract, terms and conditions,
              scope of work, and signature page.
            </p>
          </div>
        )}
      </div>

      {/* INSPECTOR SECTION */}
      <div className="p-6 border rounded shadow bg-white">
        <h2 className="text-xl font-bold mb-2">Inspector Section</h2>
        {inspectorEmailInput && (
          <p className="text-sm text-gray-600 mb-2">
            Inspector Email: <strong>{inspectorEmailInput}</strong>
          </p>
        )}
        <input
          type="text"
          placeholder="Inspector Full Name"
          value={inspectorName}
          onChange={(e) => setInspectorName(e.target.value)}
          className="border px-3 py-2 rounded w-full mb-4"
        />
        <button
          onClick={() => {
            setInspectorSignature(inspectorName);
            setInspectorInitials(getInitials(inspectorName));
          }}
          className="bg-gray-200 text-sm px-3 py-1 rounded mr-2"
        >
          Generate Signature & Initials
        </button>
        <div className="mt-2 font-signature italic text-xl text-gray-700">
          {inspectorSignature && <>✒️ {inspectorSignature}</>}
        </div>
        <div className="mt-1 font-signature text-md text-gray-500">
          {inspectorInitials && <>🖋️ Initials: {inspectorInitials}</>}
        </div>

        <button
          onClick={handleInspectorSubmit}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded"
        >
          Finalize Proposal
        </button>
      </div>

      <div className="flex justify-center mt-8">
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded"
          onClick={async () => {
            try {
              await generatePDF({
                ...formData,
                clientSignature,
                clientInitials,
                inspectorSignature,
                inspectorInitials,
                selectedAddOns: selected.map(i => optionalAddOns[i]),
              });
            } catch (err) {
              console.error("❌ Failed to generate proposal preview:", err);
              alert("Error generating proposal preview.");
            }
          }}
        >
          Preview Proposal
        </button>
      </div>
    </div>
  );
};

export default ClientProposalPage;
