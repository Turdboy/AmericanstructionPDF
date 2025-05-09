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

// 🔴 Save to drafts (single per user in inspectionsDrafts)
export const saveInspectionDraftToFirestore = async (inspection) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not logged in");

  const docRef = doc(db, "inspectionsDrafts", user.uid);

  const cleanedInspection = deepClean({
    ...inspection,
    userId: user.uid,
    savedAt: serverTimestamp(),
  });

  await setDoc(docRef, cleanedInspection, { merge: true });

  // ✅ Fetch fresh server copy to get actual savedAt value
  const updatedSnap = await getDoc(docRef);
  const updatedData = updatedSnap.data();

  console.log("✅ Draft saved and confirmed with server timestamp:", updatedData.savedAt);
  return updatedData;
};

// 🧹 Clear saved draft
export const clearSavedInspectionDraft = async (userId) => {
  const docRef = doc(db, "inspectionsDrafts", userId);
  await deleteDoc(docRef);
  console.log("🗑️ Cleared saved inspection draft for", userId);
};

// 🟣 Save permanent snapshot (multiple per user in inspectionsArchive)
export const saveInspectionToArchive = async (inspection) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not logged in");

  const archiveRef = collection(db, "inspectionsArchive");

  const cleanedInspection = deepClean({
    ...inspection,
    userId: user.uid,
    savedAt: serverTimestamp(),
  });

  const addedDocRef = await addDoc(archiveRef, cleanedInspection);

  // ✅ Fetch fresh server copy to get actual savedAt value
  const updatedSnap = await getDoc(addedDocRef);
  const updatedData = updatedSnap.data();

  console.log("✅ Archive snapshot saved and confirmed with server timestamp:", updatedData.savedAt);
  return updatedData;
};
