
// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// your config from Firebase
const firebaseConfig = {
  apiKey: "AIzaSyASvRGgaAJZSKKi1x-ushTQ2eaKv-0UN08",     // keep your real values
  authDomain: "guardian-d7d59.firebaseapp.com",
  projectId: "guardian-d7d59",
  storageBucket: "guardian-d7d59.appspot.com",
  messagingSenderId: "244746637830",
  appId: "1:244746637830:web:a3d4a1635d34bdad48e987",
  measurementId: "G-0XCDTTBQZD"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
