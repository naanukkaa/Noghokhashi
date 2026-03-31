import { db } from "./firebase.js";
import {
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const container = document.getElementById("newsContainer");

if (container) {
    const newsRef = ref(db, "news");

    onValue(newsRef, snapshot => {
        const data = snapshot.val() || {};

        const items = Object.entries(data).map(([id, value]) => ({
            id,
            ...value
        }));

        items.sort((a, b) => new Date(b.date) - new Date(a.date));

        container.innerHTML = "";

        items.forEach(item => {
            const newsItem = document.createElement("article");
            newsItem.classList.add("news-card");
            newsItem.dataset.id = item.id;
            newsItem.dataset.image = item.image || "";

            newsItem.innerHTML = `
                <div class="news-content">
                    <div class="news-title-wrapper">
                        <h2 class="news-title">${item.title || ""}</h2>
                    </div>

                    <div class="news-description-wrapper">
                        <p class="news-description">${item.description || ""}</p>
                    </div>

                    <div class="news-date-wrapper">
                        <p class="news-date">${item.date || ""}</p>
                    </div>
                </div>

                <div
                    class="news-image"
                    style="background-image:url('${item.image || ""}');
                           background-size:cover;
                           background-position:center;
                           background-repeat:no-repeat;">
                </div>
            `;

            container.appendChild(newsItem);
        });
    }, error => {
        console.error("Realtime Database load error:", error);
    });
}