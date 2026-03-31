import { db, storage, auth } from "./firebase.js";
import {
    ref as dbRef,
    onValue,
    update
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import {
    ref as storageRef,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const adminEmails = ["nanukakupreishvili4@gmail.com"];

const searchInput = document.getElementById("newsSearch");
const resultsContainer = document.getElementById("newsResults");
const form = document.getElementById("editNewsForm");

const editingNewsIdInput = document.getElementById("editingNewsId");
const titleInput = document.getElementById("newsTitle");
const descInput = document.getElementById("newsDesc");
const dateInput = document.getElementById("newsDate");
const imageInput = document.getElementById("newsImage");
const currentImagePreview = document.getElementById("currentImagePreview");
const cancelEditBtn = document.getElementById("cancelEditBtn");

let allNews = [];

auth.onAuthStateChanged(user => {
    if (!user || !adminEmails.includes(user.email)) {
        alert("Unauthorized");
        window.location.href = "/index.html";
    }
});

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

function renderResults(items) {
    resultsContainer.innerHTML = "";

    if (!items.length) {
        resultsContainer.innerHTML = `<p class="edit-result-desc">სიახლე ვერ მოიძებნა.</p>`;
        return;
    }

    items.forEach(item => {
        const card = document.createElement("div");
        card.className = "edit-result-card";

        card.innerHTML = `
            <div class="edit-result-left">
                <h3 class="edit-result-title">${item.title || ""}</h3>
                <p class="edit-result-desc">${item.description || ""}</p>
                <p class="edit-result-date">${item.date || ""}</p>
            </div>
            <button type="button" class="edit-select-btn" data-id="${item.id}">რედაქტირება</button>
        `;

        resultsContainer.appendChild(card);
    });
}

function filterNews(query) {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
        renderResults(allNews);
        return;
    }

    const filtered = allNews.filter(item => {
        const title = (item.title || "").toLowerCase();
        const desc = (item.description || "").toLowerCase();
        return title.includes(normalized) || desc.includes(normalized);
    });

    renderResults(filtered);
}

function fillForm(item) {
    editingNewsIdInput.value = item.id;
    titleInput.value = item.title || "";
    descInput.value = item.description || "";
    dateInput.value = item.date || "";
    currentImagePreview.style.backgroundImage = `url('${item.image || ""}')`;
    currentImagePreview.dataset.image = item.image || "";
    form.classList.remove("hidden");
    window.scrollTo({
        top: form.offsetTop - 100,
        behavior: "smooth"
    });
}

const newsRef = dbRef(db, "news");

onValue(newsRef, snapshot => {
    const data = snapshot.val() || {};

    allNews = Object.entries(data).map(([id, value]) => ({
        id,
        ...value
    }));

    allNews.sort((a, b) => new Date(b.date) - new Date(a.date));

    filterNews(searchInput?.value || "");
}, error => {
    console.error("Load news error:", error);
});

if (searchInput) {
    searchInput.addEventListener("input", e => {
        filterNews(e.target.value);
    });
}

resultsContainer.addEventListener("click", e => {
    const button = e.target.closest(".edit-select-btn");
    if (!button) return;

    const id = button.dataset.id;
    const selected = allNews.find(item => item.id === id);
    if (!selected) return;

    fillForm(selected);
});

if (cancelEditBtn) {
    cancelEditBtn.addEventListener("click", () => {
        form.classList.add("hidden");
        form.reset();
        editingNewsIdInput.value = "";
        currentImagePreview.style.backgroundImage = "";
        currentImagePreview.dataset.image = "";
    });
}

if (form) {
    form.addEventListener("submit", async e => {
        e.preventDefault();

        const newsId = editingNewsIdInput.value;
        const title = titleInput.value.trim();
        const description = descInput.value.trim();
        const date = dateInput.value;
        const newImageFile = imageInput.files[0];
        const oldImageUrl = currentImagePreview.dataset.image || "";

        if (!newsId || !title || !description || !date) {
            alert("გთხოვთ, შეავსოთ ყველა საჭირო ველი.");
            return;
        }

        try {
            let finalImageUrl = oldImageUrl;

            if (newImageFile) {
                const newImageRef = storageRef(
                    storage,
                    `newsImages/${Date.now()}_${Math.random().toString(36).slice(2)}_${newImageFile.name}`
                );

                await uploadBytes(newImageRef, newImageFile);
                finalImageUrl = await getDownloadURL(newImageRef);

                const oldImagePath = getStoragePathFromUrl(oldImageUrl);
                if (oldImagePath) {
                    try {
                        await deleteObject(storageRef(storage, oldImagePath));
                    } catch (err) {
                        console.warn("Old image delete failed:", err);
                    }
                }
            }

            await update(dbRef(db, `news/${newsId}`), {
                title,
                description,
                date,
                image: finalImageUrl
            });

            alert("სიახლე განახლდა!");
            showLoader();
            setTimeout(() => {
                window.location.href = "../../other-pages/news.html";
            }, 300);
            form.classList.add("hidden");
            form.reset();
            editingNewsIdInput.value = "";
            currentImagePreview.style.backgroundImage = "";
            currentImagePreview.dataset.image = "";
        } catch (error) {
            console.error("Edit error:", error);
            alert("შეცდომა მოხდა: " + error.message);
        }
    });
}