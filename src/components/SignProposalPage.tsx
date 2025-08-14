// SignProposalPage.tsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { auth } from "../firebase";



import { useParams, useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { generatePDF } from "../utils/pdfGenerator"; // adjust path if needed
import { updateDoc } from "firebase/firestore"; // ⬅️ Add this at top if not already



const SignProposalPage: React.FC = () => {

  const navigate = useNavigate();
  const location = useLocation();
const [formData, setFormData] = useState<any>({});

  const [clientEmailInput, setClientEmailInput] = useState("");
const [inspectorEmailInput, setInspectorEmailInput] = useState("");



  const [clientName, setClientName] = useState("");
  const [inspectorName, setInspectorName] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [clientConfirmed, setClientConfirmed] = useState(false);
  const [inspectorConfirmed, setInspectorConfirmed] = useState(false);


const getInitials = (name: string) => {
  const words = name.trim().split(" ");
  if (words.length === 0) return "";
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};


const [clientSignature, setClientSignature] = useState("");
const [clientInitials, setClientInitials] = useState("");
const [inspectorSignature, setInspectorSignature] = useState("");
const [inspectorInitials, setInspectorInitials] = useState("");
const [optionalAddOns, setOptionalAddOns] = useState<any[]>([]);
const [confirmationChecked, setConfirmationChecked] = useState(false);
const [inspectionData, setInspectionData] = useState<any>(null); // ⬅️ Add this at the top

const [searchParams] = useSearchParams();






















useEffect(() => {
  const fetchDraftByJobName = async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const job = searchParams.get("job");

    console.log("🌐 URL param job =", job);

    if (!job) {
      console.warn("⚠️ No job parameter found in URL.");
      return;
    }

    const docId = job; // 🔥 Use exact ID from URL without lowercasing

    const docRef = doc(db, "inspectionsDrafts", docId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      console.warn("❌ No inspection draft found for this docId.");
      return;
    }

    const data = docSnap.data();
    console.log("✅ Found inspection:", data);

    setInspectionData({ ...data, id: docId });
    setFormData(data.formData || {});
    setOptionalAddOns(data.optionalAddOns || []);
    setClientEmailInput(data.formData?.clientcontactinfo || "");
    setInspectorEmailInput(data.formData?.inspectorcontactinfo || "");

  const confirmation = data.clientConfirmation;
  console.log("📥 Firestore reload values:", {
  clientConfirmed: data.clientConfirmed,
  confirmation,
});
if (data.clientConfirmed) {
  console.log("🟢 Reload detected: clientConfirmed = true");

  setClientConfirmed(true);

  if (confirmation) {
    setClientName(confirmation.fullName || "");
    setClientSignature(confirmation.signature || "");
    setClientInitials(confirmation.initials || "");
    setConfirmationChecked(true);

    const selectedIndexes = (confirmation.selectedAddOns || []).map((selected: any) =>
      (data.optionalAddOns || []).findIndex((opt: any) => opt.title === selected.title)
    ).filter(i => i !== -1);

    setSelected(selectedIndexes);
  }
}
if (data.inspectorConfirmed) {
  console.log("🟢 Reload detected: inspectorConfirmed = true");
  setInspectorConfirmed(true);

  if (data.inspectorSignature) setInspectorSignature(data.inspectorSignature);
  if (data.inspectorInitials) setInspectorInitials(data.inspectorInitials);
}

if (data.clientConfirmed) {
  console.log("🟢 Reload detected: clientConfirmed = true");
  setClientConfirmed(true);

  if (data.clientSignature) setClientSignature(data.clientSignature);
  if (data.clientInitials) setClientInitials(data.clientInitials);
}



  };

  fetchDraftByJobName();
}, []);

















  const toggleSelection = (i: number) => {
    setSelected((prev) =>
      prev.includes(i) ? prev.filter((n) => n !== i) : [...prev, i]
    );
  };

const handleClientSubmit = async () => {
  if (!clientName.trim() || selected.length === 0) {
    alert("Client must enter name and select at least one add-on.");
    return;
  }

  await saveClientSelection();
  setClientConfirmed(true);
};



const saveClientSelection = async () => {
  const jobId = new URLSearchParams(window.location.search).get("job");
  if (!jobId) return;

  const signature = clientName;
  const initials = getInitials(clientName);
  const selectedAddOns = selected.map(i => optionalAddOns[i]);

  setClientSignature(signature);
  setClientInitials(initials);

  try {
    console.log("🧾 Saving client confirmation:");
    console.log("🖊️ Signature:", signature);
    console.log("✍️ Initials:", initials);
    console.log("📦 Selected Add-ons:", selectedAddOns);

const update: any = {
  clientConfirmed: true,
  selectedPricingOptions: selected,
  clientConfirmation: {
    fullName: clientName,
    signature,
    initials,
    selectedAddOns,
    confirmed: true,
  },
};

update.clientSignedDate = new Date().toISOString();


if (signature) update.clientSignature = signature;
if (initials) update.clientInitials = initials;

await setDoc(doc(db, "inspectionsDrafts", jobId), update, { merge: true });


    console.log("✅ Client data saved to Firestore");

    const snap = await getDoc(doc(db, "inspectionsDrafts", jobId));
    const data = snap.data();
    if (data) {
      setClientSignature(data.clientSignature || "");
      setClientInitials(data.clientInitials || "");
    }
  } catch (err) {
    console.error("🔥 Error saving client selection:", err);
  }
};






const handleInspectorSubmit = () => {
  if (!inspectorName.trim()) {
    alert("Inspector must enter name.");
    return;
  }

  console.log("📝 Inspector Signature:", inspectorName);
  console.log("🧾 Client Signature:", clientName);
  console.log("🧩 Add-ons Selected:", selected.map(i => optionalAddOns[i]));
  console.log("🚀 Ready to save data to Firestore or backend.");

  // ✅ Set confirmation flag
  setInspectorConfirmed(true);



  
};







  return (
    <div className="max-w-3xl mx-auto p-6 space-y-10">
<button
  onClick={() => {
    if (!inspectionData) {
      navigate("/revisit");
    } else {
      navigate("/inspection/commercial", { state: { data: inspectionData } });
    }
  }}
  className="text-blue-600 underline mb-6"
>
  ← Back
</button>




<div className="text-center text-2xl font-bold mb-6">
  Job Name: {formData?.propertyName || "Untitled"}
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
    className="bg-gray-200 text-sm px-3 py-1 rounded mr-2"
  >
    Generate Signature & Initials
  </button>


  <div className="mt-4">
  <label className="flex items-start gap-2 text-sm">
    <input
      type="checkbox"
      checked={confirmationChecked}
      onChange={(e) => setConfirmationChecked(e.target.checked)}
      className="mt-1"
    />
    <span>
      My <strong>signature</strong> will appear on the Signature page. My <strong>initials</strong> will appear on the Scope of Work, Terms and Conditions, and Contract pages.
    </span>
  </label>
</div>



  <div className="mt-2 font-signature italic text-xl text-gray-700">
    {clientSignature && <>✒️ {clientSignature}</>}
  </div>
  <div className="mt-1 font-signature text-md text-gray-500">
    {clientInitials && <>🖋️ Initials: {clientInitials}</>}
  </div>
</div>


            {optionalAddOns.length > 0 && (
              <>
                <h3 className="font-semibold mb-2">Pricing Options: (you can select more than one)</h3>
                {optionalAddOns.map((addon: any, i: number) => (
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
  disabled={
    !clientSignature || !confirmationChecked || selected.length === 0
  }
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

  {inspectorConfirmed ? (
    <div className="text-green-700 font-semibold text-lg">
      ✅ {inspectorName} has finalized the proposal.
    </div>
  ) : (
    <>
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

      <div className="mb-4 space-y-2">
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
      </div>

      <button
        onClick={async () => {
  const signature = inspectorName;
  const initials = getInitials(inspectorName);

  setInspectorSignature(signature);
  setInspectorInitials(initials);
  setInspectorConfirmed(true);

  try {
    const searchParams = new URLSearchParams(window.location.search);
    const jobId = searchParams.get("job");
    if (!jobId) return;

    console.log("🧪 Attempting to save:");
    console.log("🖊️ Signature:", signature);
    console.log("✍️ Initials:", initials);

const update: any = {
  inspectorConfirmed: true,
};

update.inspectorSignedDate = new Date().toISOString();

if (signature) update.inspectorSignature = signature;
if (initials) update.inspectorInitials = initials;

await setDoc(doc(db, "inspectionsDrafts", jobId), update, { merge: true });



    console.log("✅ Inspector signature saved to Firestore");
  } catch (err) {
    console.error("🔥 Firestore update error:", err);
  }
}}


        className="bg-green-600 text-white px-6 py-2 rounded"
      >
        Finalize Proposal
      </button>
    </>
  )}
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

export default SignProposalPage;
