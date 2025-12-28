/**
 * MAIN.JS - Full Login Logic
 * Login email + kode referral dengan Firebase Auth + Firestore
 * DocId Firestore = email user
 */

// --- [FIREBASE CONFIG & INIT] ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

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
const auth = getAuth(app);
const db = getFirestore(app);

// --- [VALIDATION] ---
const validateEmail = email => String(email).toLowerCase()
  .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

// --- [PARTICLES EFFECTS] ---
function initParticles() {
  const container = document.querySelector('.particles');
  if (!container) return;
  let timeout;
  const create = () => {
    container.innerHTML = '';
    if (window.innerWidth >= 769) {
      const frag = document.createDocumentFragment();
      for (let i = 0; i < 40; i++) {
        const span = document.createElement('span');
        span.style.setProperty('--x', `${Math.random() * 100}%`);
        span.style.setProperty('--y', `${Math.random() * 100}%`);
        span.style.animationDuration = `${2 + Math.random() * 3}s`;
        span.style.animationDelay = `${Math.random() * 5}s`;
        frag.appendChild(span);
      }
      container.appendChild(frag);
    }
  };
  create();
  window.addEventListener('resize', () => { clearTimeout(timeout); timeout = setTimeout(create, 250); });
}

// --- [UI HELPERS] ---
function initUiHelpers() {
  document.querySelectorAll('.toggle-pass').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      if (input && input.tagName === 'INPUT') {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        btn.textContent = isPassword ? 'Hide' : 'Show';
      }
    });
  });
}

// --- [FORM VALIDATION] ---
function initValidation(formElement) {
  if (!formElement) return;
  const inputs = formElement.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      const field = input.closest('.field');
      if (!field) return;
      let isValid = false;
      const value = input.value.trim();
      if (value === '') { field.classList.remove('valid', 'invalid'); return; }
      if (input.type === 'email') isValid = validateEmail(value);
      else if (input.hasAttribute('required')) isValid = value.length >= 4;
      else isValid = true;
      if (isValid) { field.classList.add('valid'); field.classList.remove('invalid'); }
      else { field.classList.add('invalid'); field.classList.remove('valid'); }
    });
  });
}

// --- [MAIN LOGIN LOGIC] ---
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initUiHelpers();

  const loginForm = document.getElementById('loginForm');
  const forgotBtn = document.getElementById('forgotPassword');

  onAuthStateChanged(auth, user => { if (user) console.log('Session aktif:', user.email); });

  if (!loginForm) return;
  const submitBtn = loginForm.querySelector('button[type="submit"]');
  initValidation(loginForm);

  loginForm.addEventListener('submit', async e => {
    e.preventDefault();

    const emailInput = loginForm.querySelector('input[name="email"]').value.trim();
    const passwordInput = loginForm.querySelector('input[name="password"]').value.trim();
    if (!emailInput || !passwordInput || !validateEmail(emailInput)) {
      alert('Isi email dan kode akses yang valid.'); return;
    }

    try {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Memverifikasi...';

      // 1. Firebase Auth
      await signInWithEmailAndPassword(auth, emailInput, passwordInput);

      // 2. Firestore
      const userDocRef = doc(db, "users", emailInput);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) throw new Error('USER_NOT_FOUND_IN_DB');

      const userData = userDoc.data();
      if (userData.referral !== passwordInput) throw new Error('REFERRAL_MISMATCH');

      console.log('Login Berhasil!', userData.fullName || emailInput);
      sessionStorage.setItem('userName', userData.fullName || 'User');
      window.location.href = 'dashboard.html';

    } catch (error) {
      console.error('Error Detail:', error.code, error.message);
      let errorMsg = 'Gagal masuk. Periksa data Anda.';
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') errorMsg = 'Email atau Kode Akses salah.';
      else if (error.message === 'USER_NOT_FOUND_IN_DB') errorMsg = 'Data profil tidak ditemukan di database.';
      else if (error.message === 'REFERRAL_MISMATCH') errorMsg = 'Kode Akses tidak sinkron dengan database.';
      else if (error.code === 'auth/too-many-requests') errorMsg = 'Terlalu banyak percobaan. Coba lagi nanti.';
      else if (error.code === 'permission-denied') errorMsg = 'Akses ditolak. Pastikan Anda terdaftar.';

      alert(errorMsg);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Login';
    }
  });

  if (forgotBtn) {
    forgotBtn.addEventListener('click', async e => {
      e.preventDefault();
      const email = loginForm.querySelector('input[name="email"]').value.trim();
      if (!email || !validateEmail(email)) return alert('Masukkan email valid.');
      try { await sendPasswordResetEmail(auth, email); alert('Instruksi reset dikirim ke email.'); }
      catch (err) { alert('Gagal kirim reset: ' + err.message); }
    });
  }
});
