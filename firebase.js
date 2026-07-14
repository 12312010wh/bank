import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBO1zyoxc61Z2xQTjGk9aRY-aWGm94213w",
  authDomain: "bank-ba692.firebaseapp.com",
  projectId: "bank-ba692",
  storageBucket: "bank-ba692.firebasestorage.app",
  messagingSenderId: "97231157000",
  appId: "1:97231157000:web:bd62b1e6a4d666297bdebd",
  measurementId: "G-LMZQ00S210"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
