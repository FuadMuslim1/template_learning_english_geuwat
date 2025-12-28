import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { loadUserProgress, saveUserProgress } from "./progressChart.js";

// --- Firebase Config ---
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let progressChart;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userEmail = user.email;

    // Tampilkan info user
    const userRef = db.collection("users").doc(userEmail);
    const userSnap = await userRef.get();
    if (userSnap.exists()) {
      const data = userSnap.data();
      document.getElementById("userFullName").textContent = data.fullName;
      document.getElementById("userReferralCode").textContent = data.referralCode;
      document.getElementById("userBalance").textContent = data.balance;
    }

    // Inisialisasi Chart.js
    const ctx = document.getElementById("progressChart").getContext("2d");
    progressChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Pronunciation", "Vocabulary", "Grammar", "Speaking"],
        datasets: [{
          label: "Progress %",
          data: [0, 0, 0, 0],
          backgroundColor: "#4a90e2"
        }]
      },
      options: {
        scales: { y: { beginAtZero: true, max: 100 } }
      }
    });

    // Load progres user
    await loadUserProgress(db, userEmail, progressChart);

    // Save Progress
    document.getElementById("saveProgressBtn").addEventListener("click", () => {
      saveUserProgress(db, userEmail, progressChart);
    });

  } else {
    window.location.href = "index.html";
  }
});

// Start Journey
document.getElementById("startJourneyBtn").addEventListener("click", () => {
  alert("Memulai journey belajar...");
});
