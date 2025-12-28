import { sendPasswordResetEmail } from
"https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { auth } from "./firebase.js";

document.getElementById("resetBtn").onclick = async () => {
  try {
    await sendPasswordResetEmail(auth, email.value);
    alert("Link reset dikirim ke email");
  } catch (err) {
    alert(err.message);
  }
};
