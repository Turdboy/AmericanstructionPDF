import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";

export const saveInspectionDraft = async (inspectionData: any) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  const userDraftsRef = collection(db, "inspections", user.uid, "drafts");

  await addDoc(userDraftsRef, {
    ...inspectionData,
    savedAt: serverTimestamp(),
  });
};

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase"; // ✅ adjust if yours is elsewhere

export const uploadFileAndGetURL = async (
  file: File,
  userId: string,
  folder: string = "uploads"
): Promise<string> => {
  const storageRef = ref(storage, `${userId}/${folder}/${file.name}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
};
