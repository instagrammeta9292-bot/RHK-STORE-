// =======================
// Firebase Config
// =======================

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

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

// =======================
// Upload Post
// =======================

async function uploadPost() {

    const user = auth.currentUser;

    if (!user) {
        location = "index.html";
        return;
    }

    const file = document.getElementById("image").files[0];
    const caption = document.getElementById("caption").value.trim();

    if (!file) {
        document.getElementById("msg").innerHTML = "Please select an image.";
        return;
    }

    document.getElementById("msg").innerHTML = "Uploading...";

    const formData = new FormData();

    formData.append("file", file);

    // Your Upload Preset
    formData.append("upload_preset", "rhk_upload");

    try {

        const response = await fetch(
            "https://api.cloudinary.com/v1_1/nhy9lfkt/image/upload",
            {
                method: "POST",
                body: formData
            }
        );

        const image = await response.json();

        if (!image.secure_url) {
            document.getElementById("msg").innerHTML = "Upload failed.";
            return;
        }

        const userDoc = await db.collection("users").doc(user.uid).get();

        const userData = userDoc.data();

        await db.collection("posts").add({

            uid: user.uid,
            username: userData.username,
            fullname: userData.fullname,
            photo: userData.photo,

            imageUrl: image.secure_url,

            caption: caption,

            likes: 0,

            createdAt: firebase.firestore.FieldValue.serverTimestamp()

        });

        document.getElementById("preview").style.display = "block";
        document.getElementById("preview").src = image.secure_url;

        document.getElementById("msg").innerHTML = "Post uploaded successfully.";

        setTimeout(() => {

            window.location = "home.html";

        }, 1500);

    } catch (error) {

        document.getElementById("msg").innerHTML = error.message;

    }

}
