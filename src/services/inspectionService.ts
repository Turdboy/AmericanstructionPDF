import { doc, setDoc, deleteDoc, collection, addDoc } from "firebase/firestore";
import { auth } from "../firebase";
import { db } from "../firebase";
import { serverTimestamp } from "firebase/firestore";

export const saveInspectionDraftToFirestore = async (inspection) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Not logged in");

    const docRef = doc(db, "inspections", user.uid); // single doc per user

    await setDoc(docRef, {
        ...inspection,
        userId: user.uid,
        savedAt: serverTimestamp(),
    }, { merge: true });
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

  await addDoc(archiveRef, {
      ...inspection,
      userId: user.uid,
      savedAt: serverTimestamp(),
  });

  console.log("✅ Saved inspection snapshot to archive for revisit.");
};
