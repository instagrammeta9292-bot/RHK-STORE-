// Import the Firebase modules from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup, 
  GoogleAuthProvider,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Your verified Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHUju18VBAdDFoQJhsVWp7oUqBxhfwThE",
  authDomain: "rhk-app-e34c6.firebaseapp.com",
  projectId: "rhk-app-e34c6",
  storageBucket: "rhk-app-e34c6.firebasestorage.app",
  messagingSenderId: "1016565109006",
  appId: "1:1016565109006:web:eb7ec260a601a16e5ac75f",
  measurementId: "G-814PTRRQVQ"
};

// Initialize Firebase & Auth
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// DOM Elements
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const googleBtn = document.getElementById('google-btn');
const forgotPassBtn = document.getElementById('forgot-pass-btn');
const signupToggle = document.getElementById('signup-toggle');
const messageBox = document.getElementById('auth-message');
const submitBtn = document.querySelector('.submit-btn');

let isSignUpMode = false;

// Helper to show error/success feedback
function showMessage(text, type = 'error') {
  messageBox.textContent = text;
  messageBox.className = `alert ${type}`;
}

// 1. Handle Email & Password (Login or Registration)
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = emailInput.value;
  const password = passwordInput.value;
  
  try {
    if (isSignUpMode) {
      // Create new user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      showMessage("Account created successfully! Welcome.", "success");
      console.log("Registered:", userCredential.user);
    } else {
      // Sign in existing user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      showMessage("Successfully signed in!", "success");
      console.log("Logged In:", userCredential.user);
      // Redirect your user here (e.g., window.location.href = '/dashboard')
    }
  } catch (error) {
    console.error(error);
    // Standardizing messy Firebase backend error codes into readable text
    if (error.code === 'auth/invalid-credential') {
      showMessage("Incorrect email or password.");
    } else if (error.code === 'auth/email-already-in-use') {
      showMessage("This email is already registered.");
    } else if (error.code === 'auth/weak-password') {
      showMessage("Password should be at least 6 characters.");
    } else {
      showMessage(error.message);
    }
  }
});

// 2. Handle Google Sign-In Popup
googleBtn.addEventListener('click', async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    showMessage(`Signed in as ${result.user.displayName}`, "success");
    console.log("Google User:", result.user);
  } catch (error) {
    console.error(error);
    if (error.code !== 'auth/popup-closed-by-user') {
      showMessage("Google authentication failed. Please try again.");
    }
  }
});

// 3. Handle Password Reset
forgotPassBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  const email = emailInput.value;
  if (!email) {
    showMessage("Please enter your email address first to reset password.");
    return;
  }
  
  try {
    await sendPasswordResetEmail(auth, email);
    showMessage("Password reset email sent! Check your inbox.", "success");
  } catch (error) {
    showMessage("Failed to send reset link: " + error.message);
  }
});

// 4. Toggle between Sign In and Sign Up views dynamically
signupToggle.addEventListener('click', (e) => {
  e.preventDefault();
  isSignUpMode = !isSignUpMode;
  
  if (isSignUpMode) {
    document.querySelector('.login-header h2').textContent = "Create an account";
    submitBtn.textContent = "Sign up";
    signupToggle.textContent = "Sign in";
    document.querySelector('.login-footer p').childNodes[0].textContent = "Already have an account? ";
  } else {
    document.querySelector('.login-header h2').textContent = "Welcome back";
    submitBtn.textContent = "Sign in";
    signupToggle.textContent = "Sign up";
    document.querySelector('.login-footer p').childNodes[0].textContent = "Don't have an account? ";
  }
});
