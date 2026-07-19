// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

// Your Firebase Config
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

// Password Show/Hide
const password = document.getElementById("password");
const toggle = document.getElementById("togglePassword");

toggle.addEventListener("click", () => {

    if (password.type === "password") {
        password.type = "text";
        toggle.textContent = "🙈";
    } else {
        password.type = "password";
        toggle.textContent = "👁";
    }

});

// Email Login
document.getElementById("loginForm").addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const pass = password.value;

    try {

        await signInWithEmailAndPassword(auth, email, pass);

        alert("Login Successful!");

        window.location.href = "home.html";

    } catch (error) {

        alert(error.message);

    }

});

// Google Login
const provider = new GoogleAuthProvider();

document.getElementById("googleLogin").addEventListener("click", async () => {

    try {

        await signInWithPopup(auth, provider);

        alert("Google Login Successful!");

        window.location.href = "home.html";

    } catch (error) {

        alert(error.message);

    }

});
