import { auth, db } from './firebase-config.js';
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let selectedFile = null;

document.getElementById('profilePicInput').addEventListener('change', (e) => {
    selectedFile = e.target.files[0];
    if (selectedFile) {
        document.getElementById('avatarPreview').src = URL.createObjectURL(selectedFile);
    }
});

document.getElementById('completeBtn').addEventListener('click', async () => {
    const username = document.getElementById('username').value.trim();
    const bio = document.getElementById('bio').value.trim();
    const privacy = document.getElementById('privacy').value;
    const user = auth.currentUser;

    if (!username) {
        alert("Please choose a username.");
        return;
    }

    let photoUrl = user.photoURL || "https://via.placeholder.com/100";

    try {
        // Upload profile image to Cloudinary if selected
        if (selectedFile) {
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("upload_preset", "rhk_upload");

            const res = await fetch("https://api.cloudinary.com/v1_1/nhy9Ifkt/image/upload", {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            if (data.secure_url) photoUrl = data.secure_url;
        }

        // Save profile data into Firestore
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            email: user.email,
            username: username,
            bio: bio,
            privacy: privacy,
            photoUrl: photoUrl,
            onboarded: true,
            createdAt: new Date()
        });

        window.location.href = "index.html";
    } catch (err) {
        console.error(err);
        alert("Error saving profile: " + err.message);
    }
});

