import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase"; // make sure firebase.ts exports `storage`

/**
 * Upload a file to Firebase Storage and return its public URL
 */
export const uploadImageToStorage = async (file: File, path: string): Promise<string> => {
  const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};