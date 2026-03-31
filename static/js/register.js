import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("registerForm");

    // stop script if this page doesn't have the register form
    if (!form) return;

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");

        if (!emailInput || !passwordInput) return;

        const email = emailInput.value;
        const password = passwordInput.value;

        try {

            await createUserWithEmailAndPassword(auth, email, password);

            alert("Registration successful");
            window.location.href = "loginlogin222222.html";

        } catch (error) {

            alert(error.message);
            console.error(error);

        }

    });

});