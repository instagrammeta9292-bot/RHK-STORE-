import { auth, db } from "./firebase.js";

import {
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs,
    doc,
    setDoc,
    serverTimestamp
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

// Signup Form
document.getElementById("signupForm").addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const username = document.getElementById("username").value.trim().toLowerCase();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    try {

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

        // Create Firebase Auth account
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        const user = userCredential.user;

        // Save user in Firestore
        await setDoc(doc(db, "users", user.uid), {

            uid: user.uid,
            name: name,
            username: username,
            email: email,
            photo: "",
            bio: "",
            verified: false,
            followers: 0,
            following: 0,
            posts: 0,
            createdAt: serverTimestamp()

        });

        alert("Account created successfully!");

        window.location.href = "home.html";

    } catch (error) {

        switch (error.code) {

            case "auth/email-already-in-use":
                alert("Email already exists.");
                break;

            case "auth/weak-password":
                alert("Password must be at least 6 characters.");
                break;

            case "auth/invalid-email":
                alert("Invalid email.");
                break;

            default:
                alert(error.message);

        }

    }

});
