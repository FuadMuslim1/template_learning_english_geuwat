

// firebase/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDc24eHGwIFcltfsYOwuhig8whHQuhfJ7U",
  authDomain: "learning-english-geuwat-d7555.firebaseapp.com",
  projectId: "learning-english-geuwat-d7555",
  storageBucket: "learning-english-geuwat-d7555.firebasestorage.app",
  messagingSenderId: "110497450552",
  appId: "1:110497450552:web:1de6e8e96d77318988b4cd",
  measurementId: "G-SD5W12S7ZZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);