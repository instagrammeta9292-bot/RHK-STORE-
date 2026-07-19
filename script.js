import { db, auth } from './firebase-config.js';
import { collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

function loadFeed() {
    const q = query(collection(db, "posts"), where("uid", "==", auth.currentUser.uid));
    onSnapshot(q, (snapshot) => {
        const feed = document.getElementById('dynamic-feed-list');
        feed.innerHTML = '';
        snapshot.forEach(doc => {
            const post = doc.data();
            feed.innerHTML += `<img src="${post.url}" style="width:100%">`;
        });
    });
}
