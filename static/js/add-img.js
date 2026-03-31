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

const adminEmails = ["nanukakupreishvili4@gmail.com"];

const form = document.getElementById("galleryForm");
const imageInput = document.getElementById("galleryImage");
const preview = document.getElementById("galleryPreview");
const cancelBtn = document.getElementById("cancelGalleryBtn");

auth.onAuthStateChanged(user => {
    if (!user || !adminEmails.includes(user.email)) {
        alert("Unauthorized");
        window.location.href = "/index.html";
    }
});

if (imageInput && preview) {
    imageInput.addEventListener("change", e => {
        const file = e.target.files[0];
        if (!file) {
            preview.style.backgroundImage = "";
            return;
        }

        const reader = new FileReader();
        reader.onload = event => {
            preview.style.backgroundImage = `url('${event.target.result}')`;
        };
        reader.readAsDataURL(file);
    });
}

if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
        if (form) form.reset();
        if (preview) preview.style.backgroundImage = "";
    });
}

if (form) {
    form.addEventListener("submit", async e => {
        e.preventDefault();

        const user = auth.currentUser;
        if (!user || !adminEmails.includes(user.email)) {
            alert("არ გაქვს დამატების უფლება");
            return;
        }

        const file = imageInput?.files[0];
        if (!file) {
            alert("აირჩიე სურათი.");
            return;
        }

        try {
            const fileRef = storageRef(
                storage,
                `galleryImages/${Date.now()}_${Math.random().toString(36).slice(2)}_${file.name}`
            );

            await uploadBytes(fileRef, file);
            const imageURL = await getDownloadURL(fileRef);

            const galleryRef = dbRef(db, "gallery");
            const newGalleryRef = push(galleryRef);

            await set(newGalleryRef, {
                image: imageURL,
                date: new Date().toISOString().split("T")[0]
            });

            alert("სურათი დაემატა!");
            if (window.showLoader) window.showLoader();

            setTimeout(() => {
                window.location.href = "../gallery.html";
            }, 150);

        } catch (error) {
            console.error("Gallery upload error:", error);
            alert("შეცდომა მოხდა: " + error.message);
        }
    });
}