// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBlzCviUBLtR727JvWKLBHTLmlb-zjun4o",
  authDomain: "americanstructionpdf.firebaseapp.com",
  projectId: "americanstructionpdf",
  storageBucket: "americanstructionpdf.firebasestorage.app", // ✅ CORRECT
  messagingSenderId: "697960894223",
  appId: "1:697960894223:web:10047745a90dfc388db87a",
  measurementId: "G-7M3YZ5T0B4"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

import { collection, addDoc, serverTimestamp } from "firebase/firestore";

/**
 * Saves a draft inspection tied to the logged-in Firebase user
 */
export const saveInspectionDraft = async (inspectionData: any) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const userDraftsRef = collection(db, "inspections", user.uid, "drafts");

  await addDoc(userDraftsRef, {
    ...inspectionData,
    savedAt: serverTimestamp(),
  });
};
