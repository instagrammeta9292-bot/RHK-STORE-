import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const btn = document.getElementById('loginBtn');
btn?.addEventListener('click', async () => {
    const e = document.getElementById('email').value;
    const p = document.getElementById('password').value;
    try {
        await signInWithEmailAndPassword(auth, e, p);
        window.location.href = "index.html";
    } catch(err) { alert(err.message); }
});

onAuthStateChanged(auth, (user) => {
    if (!user && !window.location.pathname.includes("login.html")) window.location.href = "login.html";
});
