// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBlzCviUBLtR727JvWKLBHTLmlb-zjun4o",
    authDomain: "americanstructionpdf.firebaseapp.com",
    projectId: "americanstructionpdf",
    storageBucket: "americanstructionpdf.appspot.com",
    messagingSenderId: "697960894223",
    appId: "1:697960894223:web:10047745a90dfc388db87a",
    measurementId: "G-7M3YZ5T0B4"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
