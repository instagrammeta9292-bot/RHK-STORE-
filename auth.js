import { auth } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Redirect to login if user is not authenticated
onAuthStateChanged(auth, (user) => {
    if (!user && window.location.pathname !== "/login.html") {
        window.location.href = "login.html";
    }
});

