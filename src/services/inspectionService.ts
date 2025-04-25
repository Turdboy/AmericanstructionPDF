// src/services/inspectionService.ts
import { db, auth } from "../firebase";
import { addDoc, collection, getDocs, query, where, serverTimestamp } from "firebase/firestore";

export interface InspectionData {
  formData: any;
  roofSections: any[];
  images: any[];
  overviewImages: any[];
  droneImages: any[];
}

export const saveInspectionDraftToFirestore = async (inspection: InspectionData) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not logged in");

  await addDoc(collection(db, "inspections"), {
    ...inspection,
    userId: user.uid,
    timestamp: serverTimestamp(),
  });
};


export const getUserDraftsFromFirestore = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not logged in");

  const userDraftsRef = collection(db, "inspections", user.uid, "drafts");
  const snapshot = await getDocs(userDraftsRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
