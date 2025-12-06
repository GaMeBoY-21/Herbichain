// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCKf_y2NC09s391oT3BTmpKFcrReYtnHsw",
  authDomain: "herbichain.firebaseapp.com",
  projectId: "herbichain",
  storageBucket: "herbichain.firebasestorage.app",
  messagingSenderId: "584188383620",
  appId: "1:584188383620:web:3012f98638b911b9760dd1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
