import { db, auth } from './firebase-config.js';
import { collection, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 1. Listen for auth changes and fetch the feed once verified
auth.onAuthStateChanged((user) => {
    if (user) {
        loadGlobalFeed();
    }
});

// 2. Fetch and render posts from Firestore database
function loadGlobalFeed() {
    const feedContainer = document.getElementById('dynamic-feed-list');
    if (!feedContainer) return;

    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

    onSnapshot(q, (snapshot) => {
        feedContainer.innerHTML = '';
        
        if (snapshot.empty) {
            feedContainer.innerHTML = '<p class="no-posts">No posts yet. Click the + button to upload!</p>';
            return;
        }

        snapshot.forEach((docSnapshot) => {
            const post = docSnapshot.data();
            const postElement = document.createElement('div');
            postElement.className = 'post-card';
            
            let mediaContent = '';
            if (post.mode === 'video') {
                mediaContent = `<video src="${post.url}" controls class="post-media"></video>`;
            } else {
                mediaContent = `<img src="${post.url}" alt="Post image" class="post-media">`;
            }

            postElement.innerHTML = `
                <div class="post-header">
                    <span class="post-user">RHK User</span>
                </div>
                ${mediaContent}
                <div class="post-footer">
                    <p class="post-caption">${post.caption || ''}</p>
                </div>
            `;
            feedContainer.appendChild(postElement);
        });
    });
}

// 3. Bind Upload Trigger Button to post.js functionality
document.getElementById('triggerUpload')?.addEventListener('click', () => {
    if (typeof window.launchPostUpload === 'function') {
        window.launchPostUpload();
    } else {
        const picker = document.getElementById('global-file-picker');
        if (picker) picker.click();
    }
});

// 4. Logout Handler
document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    try {
        await signOut(auth);
        window.location.href = "login.html";
    } catch (error) {
        console.error("Sign out error:", error);
    }
});
