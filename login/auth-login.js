import { signInWithEmailAndPassword } from
"https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { auth } from "./firebase.js";

document.getElementById("loginBtn").onclick = async () => {
  const email = email.value;
  const password = password.value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "/dashboard.html";
  } catch (err) {
    alert(err.message);
  }
};
