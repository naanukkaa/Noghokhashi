import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const form = document.getElementById("login-form");

form.addEventListener("submit", function(e) {
    e.preventDefault(); // THIS STOPS FORM FROM POSTING

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert("Login successful");

            // Redirect to another page
            window.location.href = "../index.html"; 
        })
        .catch((error) => {
            alert(error.message);
        });
});