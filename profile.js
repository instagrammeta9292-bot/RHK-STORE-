// =========================
// Firebase Config
// =========================

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

// =========================
// Check Login
// =========================

auth.onAuthStateChanged((user) => {

    if (!user) {
        window.location.href = "index.html";
        return;
    }

});

// =========================
// Save Profile
// =========================

async function saveProfile() {

    const user = auth.currentUser;

    if (!user) return;

    const username = document.getElementById("username").value.trim().toLowerCase();
    const fullname = document.getElementById("fullname").value.trim();
    const bio = document.getElementById("bio").value.trim();

    if (username === "" || fullname === "") {

        document.getElementById("msg").innerHTML =
        "Please fill all required fields.";

        return;
    }

    try {

        // Check if username already exists
        const usernameDoc =
        await db.collection("usernames").doc(username).get();

        if (usernameDoc.exists) {

            document.getElementById("msg").innerHTML =
            "Username already taken.";

            return;
        }

        // Save user profile
        await db.collection("users").doc(user.uid).set({

            uid: user.uid,
            email: user.email,
            username: username,
            fullname: fullname,
            bio: bio,
            photo: user.photoURL || "",
            createdAt: firebase.firestore.FieldValue.serverTimestamp()

        });

        // Reserve username
        await db.collection("usernames").doc(username).set({

            uid: user.uid

        });

        // Go to Home
        window.location.href = "home.html";

    } catch (error) {

        document.getElementById("msg").innerHTML =
        error.message;

    }

}
