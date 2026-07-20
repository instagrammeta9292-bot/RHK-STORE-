import { auth, db } from './firebase-config.js';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const googleBtn = document.getElementById('googleLoginBtn');

if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Check if user already completed onboarding
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists() && userDoc.data().onboarded) {
                window.location.href = "index.html";
            } else {
                window.location.href = "onboarding.html";
            }
        } catch (error) {
            alert("Google Sign-In Error: " + error.message);
        }
    });
}

// Global Routing Protection
onAuthStateChanged(auth, async (user) => {
    const path = window.location.pathname;
    const isLogin = path.includes("login.html") || path === "" || path.endsWith("/");
    const isOnboarding = path.includes("onboarding.html");

    if (!user && !isLogin) {
        window.location.href = "login.html";
    } else if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const onboarded = userDoc.exists() && userDoc.data().onboarded;

        if (!onboarded && !isOnboarding) {
            window.location.href = "onboarding.html";
        } else if (onboarded && (isLogin || isOnboarding)) {
            window.location.href = "index.html";
        }
    }
});
