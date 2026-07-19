import { db, auth } from './firebase-config.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function uploadPost(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "rhk_upload");

    const res = await fetch("https://api.cloudinary.com/v1_1/nhy9Ifkt/auto/upload", {
        method: "POST", body: formData
    });
    const data = await res.json();

    await addDoc(collection(db, "posts"), {
        url: data.secure_url,
        uid: auth.currentUser.uid,
        createdAt: new Date()
    });
    alert("Post Saved!");
}
