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

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

function signup(){

let email=document.getElementById("email").value;
let password=document.getElementById("password").value;

auth.createUserWithEmailAndPassword(email,password)

.then(()=>{
document.getElementById("msg").innerHTML="Account Created Successfully";

window.location="home.html";

})

.catch(error=>{
document.getElementById("msg").innerHTML=error.message;
});

}

function login(){

let email=document.getElementById("email").value;
let password=document.getElementById("password").value;

auth.signInWithEmailAndPassword(email,password)

.then(()=>{
window.location="home.html";
})

.catch(error=>{
document.getElementById("msg").innerHTML=error.message;
});

}

function googleLogin(){

const provider=new firebase.auth.GoogleAuthProvider();

auth.signInWithPopup(provider)

.then(()=>{
window.location="home.html";
})

.catch(error=>{
document.getElementById("msg").innerHTML=error.message;
});

}
