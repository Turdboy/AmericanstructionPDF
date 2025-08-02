import { doc, setDoc, deleteDoc, collection, addDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { serverTimestamp } from "firebase/firestore";











// 🧹 Recursively remove undefined values
const deepClean = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(deepClean);
  } else if (obj && typeof obj === "object") {
    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = deepClean(value);
      }
    }
    return cleaned;
  }
  return obj;
};



















export const saveInspectionDraftToFirestore = async (inspection) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not logged in");

  const propertyName = inspection?.formData?.propertyName;
  if (!propertyName || propertyName.trim() === "") {
    console.warn("⛔ No property name found — skipping save.");
    return;
  }

  const safeName = propertyName
  .replace(/\s+/g, "_")
  .replace(/[^\w\-]/g, "") // remove special chars
  .toLowerCase(); // optional: makes URLs cleaner

const docId = `${user.uid}_${safeName}`;

  const docRef = doc(db, "inspectionsDrafts", docId);

const cleanedInspection = deepClean({
  formData: inspection.formData || {},
  roofSections: inspection.roofSections || [],
  optionalAddOns: inspection.formData?.optionalAddOns || [],
  selectedScopeText: inspection.selectedScopeText || "",
  clientConfirmation: inspection.clientConfirmation || null,
  inspectorConfirmation: inspection.inspectorConfirmation || null,
  ...(inspection.inspectorSignature !== undefined && { inspectorSignature: inspection.inspectorSignature }),
  ...(inspection.inspectorInitials !== undefined && { inspectorInitials: inspection.inspectorInitials }),
  ...(inspection.clientSignature !== undefined && { clientSignature: inspection.clientSignature }),
  ...(inspection.clientInitials !== undefined && { clientInitials: inspection.clientInitials }),

  ...(inspection.clientSignedDate !== undefined && { clientSignedDate: inspection.clientSignedDate }),
...(inspection.inspectorSignedDate !== undefined && { inspectorSignedDate: inspection.inspectorSignedDate }),


  userId: user.uid,
  saveType: "auto",
});


// ✅ Now add serverTimestamp *after* deepClean, so it survives
cleanedInspection.timestamp = serverTimestamp();

await setDoc(docRef, cleanedInspection, { merge: true });


  return docId; // 🔁 let caller fetch timestamp when ready
};













// 🧹 Clear saved draft
export const clearSavedInspectionDraft = async (userId) => {
  const docRef = doc(db, "inspectionsDrafts", userId);
  await deleteDoc(docRef);
  console.log("🗑️ Cleared saved inspection draft for", userId);
};






export const saveInspectionToArchive = async (inspection) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not logged in");

  const docRef = doc(collection(db, "inspectionsArchive"));
  const cleanedInspection = {
  formData: {
    ...(inspection.formData || {}),
    optionalAddOns: inspection.optionalAddOns || [], // ✅ embed inside formData
  },
  roofSections: inspection.roofSections || [],
  finalEstimate: inspection.finalEstimate || null,
  spreadsheetUrl: inspection.spreadsheetUrl || null,
  optionalAddOns: inspection.optionalAddOns || [], // ✅ keep at root for SignProposalPage
  clientConfirmation: inspection.clientConfirmation || null,
  inspectorConfirmation: inspection.inspectorConfirmation || null,

  // 🔐 Metadata
  userId: user.uid,
  timsestamp: serverTimestamp(),
  saveType: inspection.saveType || "manual",
};


  await setDoc(docRef, cleanedInspection);
  console.log("✅ Archive saved. New doc ID:", docRef.id);
  return docRef.id;
};


