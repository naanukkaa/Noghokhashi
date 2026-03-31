import { db, storage, auth } from "./firebase.js";
import {
    ref as dbRef,
    onValue,
    remove
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import {
    ref as storageRef,
    deleteObject
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

console.log("gallery.js loaded");

const galleryContainer = document.getElementById("galleryContainer");
const deleteGalleryBtn = document.getElementById("delete-gallery-btn");
const adminDropdown = document.getElementById("adminDropdown");
const adminEmails = ["nanukakupreishvili4@gmail.com"];

let galleryDeleteMode = false;

function getStoragePathFromUrl(url) {
    if (!url || !url.includes("/o/")) return null;

    try {
        const encodedPath = url.split("/o/")[1].split("?")[0];
        return decodeURIComponent(encodedPath);
    } catch (error) {
        console.error("Storage path parse error:", error);
        return null;
    }
}

function createGalleryDeleteButton() {
    const btn = document.createElement("button");
    btn.className = "gallery-delete-btn";
    btn.type = "button";
    btn.textContent = "წაშლა";
    return btn;
}

function applyGalleryDeleteButtons() {
    document.querySelectorAll(".gallery-item").forEach(item => {
        const existingBtn = item.querySelector(".gallery-delete-btn");

        if (galleryDeleteMode) {
            if (!existingBtn) {
                item.style.position = "relative";
                item.appendChild(createGalleryDeleteButton());
            }
        } else {
            if (existingBtn) {
                existingBtn.remove();
            }
        }
    });

    console.log("gallery delete buttons:", document.querySelectorAll(".gallery-delete-btn").length);
}

function buildGalleryItem(item, id) {
    const card = document.createElement("div");
    card.className = "gallery-item";
    card.dataset.id = id;
    card.dataset.image = item.image || "";

    card.innerHTML = `
        <img src="${item.image || ""}" alt="gallery image" class="gallery-img">
    `;

    return card;
}

auth.onAuthStateChanged(user => {
    if (!adminDropdown) return;

    if (user && adminEmails.includes(user.email)) {
        adminDropdown.style.display = "flex";
    } else {
        adminDropdown.style.display = "none";
    }
});

if (galleryContainer) {
    const galleryRef = dbRef(db, "gallery");

    onValue(galleryRef, snapshot => {
        const data = snapshot.val() || {};

        const items = Object.entries(data).map(([id, value]) => ({
            id,
            ...value
        }));

        items.sort((a, b) => new Date(b.date) - new Date(a.date));

        galleryContainer.innerHTML = "";

        items.forEach(item => {
            galleryContainer.appendChild(buildGalleryItem(item, item.id));
        });

        if (galleryDeleteMode) {
            applyGalleryDeleteButtons();
        }

        console.log("gallery rendered:", items.length);
    }, error => {
        console.error("Gallery load error:", error);
    });
}

if (deleteGalleryBtn) {
    deleteGalleryBtn.addEventListener("click", e => {
        e.preventDefault();
        console.log("delete gallery clicked");

        galleryDeleteMode = !galleryDeleteMode;
        console.log("gallery delete mode:", galleryDeleteMode);
        console.log("gallery items found:", document.querySelectorAll(".gallery-item").length);

        applyGalleryDeleteButtons();
    });
}

document.addEventListener("click", async e => {
    const deleteBtn = e.target.closest(".gallery-delete-btn");
    if (!deleteBtn) return;

    const item = deleteBtn.closest(".gallery-item");
    if (!item) return;

    const user = auth.currentUser;
    if (!user || !adminEmails.includes(user.email)) {
        alert("არ გაქვს წაშლის უფლება");
        return;
    }

    const galleryId = item.dataset.id;
    const imageUrl = item.dataset.image;

    if (!galleryId) {
        console.error("No gallery ID found");
        return;
    }

    if (!confirm("დარწმუნებული ხარ რომ გინდა წაშლა?")) return;

    try {
        if (imageUrl) {
            const path = getStoragePathFromUrl(imageUrl);
            if (path) {
                await deleteObject(storageRef(storage, path));
            }
        }

        await remove(dbRef(db, `gallery/${galleryId}`));
        console.log("gallery deleted");
    } catch (error) {
        console.error("Gallery delete error:", error);
        alert("შეცდომა წაშლის დროს");
    }
});