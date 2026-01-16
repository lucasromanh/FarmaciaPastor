import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBMwJkOV-4sLFPaw9WFcvLOpBC0p-ekDI8",
  authDomain: "farmacia-pastor.firebaseapp.com",
  projectId: "farmacia-pastor",
  storageBucket: "farmacia-pastor.firebasestorage.app",
  messagingSenderId: "69281457525",
  appId: "1:69281457525:web:2080bed1194a8a4e879f3c",
  measurementId: "G-72P0KV889X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

export default app;
