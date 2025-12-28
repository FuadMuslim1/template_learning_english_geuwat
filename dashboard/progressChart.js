import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

export async function loadUserProgress(db, userEmail, chartInstance) {
  try {
    const progressRef = doc(db, "progress", `progress-${userEmail}`);
    const progressSnap = await getDoc(progressRef);

    if (progressSnap.exists()) {
      const data = progressSnap.data();

      chartInstance.data.datasets[0].data = [
        data.pronunciation || 0,
        data.vocabulary || 0,
        data.grammar || 0,
        data.speaking || 0
      ];
      chartInstance.update();
    } else {
      console.log("Belum ada data progres user, menggunakan placeholder 0.");
    }
  } catch (error) {
    console.error("Gagal memuat progres user:", error);
  }
}

export async function saveUserProgress(db, userEmail, chartInstance) {
  const progressData = {
    englishLevel: "B1",
    pronunciation: Math.floor(Math.random() * 101),
    vocabulary: Math.floor(Math.random() * 101),
    grammar: Math.floor(Math.random() * 101),
    speaking: Math.floor(Math.random() * 101),
    quality: "Good"
  };

  try {
    const progressRef = doc(db, "progress", `progress-${userEmail}`);
    await updateDoc(progressRef, progressData);
    alert("Progress berhasil disimpan!");

    chartInstance.data.datasets[0].data = [
      progressData.pronunciation,
      progressData.vocabulary,
      progressData.grammar,
      progressData.speaking
    ];
    chartInstance.update();
  } catch (error) {
    console.error("Gagal menyimpan progres:", error);
    alert("Gagal menyimpan progress.");
  }
}
