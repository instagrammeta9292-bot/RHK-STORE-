import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAHUju18VBAdDFoQJhsVWp7oUqBxhfwThE",
  authDomain: "rhk-app-e34c6.firebaseapp.com",
  projectId: "rhk-app-e34c6",
  storageBucket: "rhk-app-e34c6.firebasestorage.app",
  messagingSenderId: "1016565109006",
  appId: "1:1016565109006:web:eb7ec260a601a16e5ac75f",
  measurementId: "G-814PTRRQVQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Google Provider
const provider = new GoogleAuthProvider();

// Google Login Button
document.getElementById("googleLogin").addEventListener("click", () => {
  signInWithRedirect(auth, provider);
});

// Handle Redirect Result
getRedirectResult(auth).catch((error) => {
  alert(error.message);
});

// Check Login State
onAuthStateChanged(auth, async (user) => {

  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  // First Login
  if (!userSnap.exists()) {

    let username = "";

    while (!username) {
      username = prompt("Choose your RHK username:");
      if (username) username = username.trim();
    }

    await setDoc(userRef, {
      uid: user.uid,
      username: username,
      name: user.displayName,
      email: user.email,
      photo: user.photoURL,
      createdAt: Date.now()
    });

  }

  // Go to Home
  window.location.href = "home.html";

});
