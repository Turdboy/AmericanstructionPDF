import { doc, setDoc, deleteDoc, collection, addDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { serverTimestamp } from "firebase/firestore";

// 🧹 Utility: recursively removes undefined values
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

  const docRef = doc(db, "inspections", user.uid); // single doc per user

  const cleanedInspection = deepClean({
    ...inspection,
    userId: user.uid,
    savedAt: serverTimestamp(),
  });

  await setDoc(docRef, cleanedInspection, { merge: true });
};

export const clearSavedInspectionDraft = async (userId) => {
  const docRef = doc(db, "inspections", userId);
  await deleteDoc(docRef);
  console.log("🗑️ Cleared saved inspection draft for", userId);
};

export const saveInspectionToArchive = async (inspection) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not logged in");

  const archiveRef = collection(db, "inspectionsArchive");

  const cleanedInspection = deepClean({
    ...inspection,
    userId: user.uid,
    savedAt: serverTimestamp(),
  });

  await addDoc(archiveRef, cleanedInspection);

  console.log("✅ Saved inspection snapshot to archive for revisit.");
};
