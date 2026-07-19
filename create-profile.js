import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp
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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

onAuthStateChanged(auth, (user) => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("profileForm").addEventListener("submit", async (e) => {

    e.preventDefault();

    const username = document
      .getElementById("username")
      .value
      .trim()
      .toLowerCase();

    const name = document
      .getElementById("name")
      .value
      .trim();

    // Check if username already exists
    const q = query(
      collection(db, "users"),
      where("username", "==", username)
    );

    const result = await getDocs(q);

    if (!result.empty) {
      alert("Username already exists.");
      return;
    }

    // Save user
    await setDoc(doc(db, "users", user.uid), {

      uid: user.uid,
      username: username,
      name: name,
      email: user.email,
      photo: user.photoURL,
      followers: 0,
      following: 0,
      posts: 0,
      verified: false,
      createdAt: serverTimestamp()

    });

    window.location.href = "home.html";

  });

});
