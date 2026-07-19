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
// =========================
// Initialize Firebase
// =========================

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

// =========================
// Create Account
// =========================

function signup() {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    auth.createUserWithEmailAndPassword(email, password)

    .then(() => {

        checkProfile();

    })

    .catch((error) => {

        document.getElementById("msg").innerHTML = error.message;

    });

}

// =========================
// Login
// =========================

function login() {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    auth.signInWithEmailAndPassword(email, password)

    .then(() => {

        checkProfile();

    })

    .catch((error) => {

        document.getElementById("msg").innerHTML = error.message;

    });

}

// =========================
// Google Login
// =========================

function googleLogin() {

    const provider = new firebase.auth.GoogleAuthProvider();

    auth.signInWithPopup(provider)

    .then(() => {

        checkProfile();

    })

    .catch((error) => {

        document.getElementById("msg").innerHTML = error.message;

    });

}

// =========================
// Check Profile
// =========================

function checkProfile() {

    const user = auth.currentUser;

    if (!user) return;

    db.collection("users")
      .doc(user.uid)
      .get()

      .then((doc) => {

          if (doc.exists) {

              window.location.href = "home.html";

          } else {

              window.location.href = "create-profile.html";

          }

      })

      .catch((error) => {

          document.getElementById("msg").innerHTML = error.message;

      });

}

// =========================
// Auto Login
// =========================

auth.onAuthStateChanged((user) => {

    if (user) {

        checkProfile();

    }

});
