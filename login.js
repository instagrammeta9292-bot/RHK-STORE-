import { auth, db } from "./firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// Show / Hide Password
const togglePassword = document.getElementById("togglePassword");
const password = document.getElementById("password");

togglePassword.addEventListener("click", () => {
    if (password.type === "password") {
        password.type = "text";
        togglePassword.textContent = "🙈";
    } else {
        password.type = "password";
        togglePassword.textContent = "👁";
    }
});

// Login Form
const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const userInput = document
        .getElementById("username")
        .value
        .trim();

    const userPassword = document
        .getElementById("password")
        .value;

    let email = userInput;

    try {

        // If the user entered a username, find the email in Firestore
        if (!userInput.includes("@")) {

            const q = query(
                collection(db, "users"),
                where("username", "==", userInput)
            );

            const snap = await getDocs(q);

            if (snap.empty) {
                alert("Username not found.");
                return;
            }

            email = snap.docs[0].data().email;
        }

        // Login with Firebase Authentication
        await signInWithEmailAndPassword(
            auth,
            email,
            userPassword
        );

        alert("Login Successful!");

        window.location.href = "home.html";

    } catch (error) {

        switch (error.code) {

            case "auth/invalid-credential":
                alert("Invalid email/username or password.");
                break;

            case "auth/user-not-found":
                alert("User not found.");
                break;

            case "auth/wrong-password":
                alert("Wrong password.");
                break;

            default:
                alert(error.message);
        }

    }

});
