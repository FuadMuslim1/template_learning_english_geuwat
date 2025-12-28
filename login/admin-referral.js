import { query, where, getDocs, collection } from "firebase/firestore";

async function getTodayIndex(db) {
  const today = new Date().toISOString().slice(0, 10);

  const q = query(
    collection(db, "referral_flows"),
    where("registerDate", "==", today)
  );

  const snap = await getDocs(q);
  return snap.size + 1;
}
