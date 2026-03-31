import { db, storage, auth } from "./firebase.js";
import {
    ref as dbRef,
    push,
    set
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import {
    ref as storageRef,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

console.log("admin.js loaded");

const form = document.getElementById("newsForm");
console.log("newsForm:", form);

if (form) {
    form.addEventListener("submit", async e => {
        e.preventDefault();
        console.log("🔥 submit fired");

        const title = document.getElementById("newsTitle")?.value.trim();
        const description = document.getElementById("newsDesc")?.value.trim();
        const date = document.getElementById("newsDate")?.value;
        const imageFile = document.getElementById("newsImage")?.files[0];

        console.log("📦 form data:", { title, description, date, imageFile });

        if (!title || !description || !date || !imageFile) {
            alert("გთხოვთ, შეავსოთ ყველა ველი.");
            return;
        }

        try {
            console.log("📤 uploading image...");

            const fileRef = storageRef(
                storage,
                `newsImages/${Date.now()}_${Math.random().toString(36).slice(2)}_${imageFile.name}`
            );

            await uploadBytes(fileRef, imageFile);
            console.log("✅ image uploaded");

            const imageURL = await getDownloadURL(fileRef);
            console.log("🌐 download URL:", imageURL);

            console.log("🧠 writing to Realtime Database...");

            const newsRootRef = dbRef(db, "news");
            const newNewsRef = push(newsRootRef);

            await set(newNewsRef, {
                title,
                description,
                date,
                image: imageURL
            });

            console.log("✅ realtime database item added:", newNewsRef.key);

            alert("სიახლე დაემატა!");
            Loader();
            form.reset();
            window.location.href = "../../other-pages/news.html";

        } catch (error) {
            console.error("❌ ERROR:", error);
            alert("შეცდომა მოხდა: " + error.message);
        }
    });
}

auth.onAuthStateChanged(user => {
    const adminEmails = ["nanukakupreishvili4@gmail.com"];

    if (!user || !adminEmails.includes(user.email)) {
        alert("Unauthorized");
        window.location.href = "/index.html";
    }
});