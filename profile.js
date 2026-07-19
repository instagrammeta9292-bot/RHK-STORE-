const firebaseConfig = {
 // Your Firebase Config
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

auth.onAuthStateChanged(user=>{

if(!user){
window.location="index.html";
return;
}

document.getElementById("photo").src =
user.photoURL || "https://via.placeholder.com/120";

});

function saveProfile(){

const user=auth.currentUser;

db.collection("users").doc(user.uid).set({

uid:user.uid,

email:user.email,

username:document.getElementById("username").value,

name:document.getElementById("name").value,

bio:document.getElementById("bio").value,

photo:user.photoURL,

createdAt:firebase.firestore.FieldValue.serverTimestamp()

})

.then(()=>{

window.location="home.html";

});

}
