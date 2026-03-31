// ===== IMPORTS =====
import { auth, db, storage } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
    ref as dbRef,
    onValue,
    remove
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import {
    ref as storageRef,
    deleteObject
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// optional for console testing
window.auth = auth;

// ===== GLOBAL STATE =====
let deleteMode = false;

// ===== LOADER =====
function showLoader() {
    const loader = document.getElementById("pageLoader");
    if (!loader) return;
    loader.classList.remove("hide");
}



// ===== HEADER SHOW/HIDE ON SCROLL & HOVER =====
const header = document.querySelector(".main-navbar");
const hoverZone = document.querySelector(".header-hover-zone");
let lastScrollY = window.scrollY;
let hideTimeout;

const showHeader = () => {
    if (!header) return;
    header.classList.remove("hide");
    clearTimeout(hideTimeout);
};

const hideHeaderDelayed = () => {
    if (!header) return;
    if (window.scrollY <= 0) return;

    hideTimeout = setTimeout(() => {
        header.classList.add("hide");
    }, 2000);
};

if (header) {
    window.addEventListener("scroll", () => {
        const currentScroll = window.scrollY;

        if (currentScroll <= 0) {
            header.classList.remove("hide");
            lastScrollY = 0;
            return;
        }

        if (currentScroll > lastScrollY) {
            header.classList.add("hide");
        } else if (currentScroll < lastScrollY) {
            header.classList.remove("hide");
        }

        lastScrollY = currentScroll;
    });
}

if (hoverZone && header) {
    [hoverZone, header].forEach(el => {
        el.addEventListener("mouseenter", showHeader);
    });

    header.addEventListener("mouseleave", hideHeaderDelayed);
}

// ===== STAT COUNTERS =====
const counters = document.querySelectorAll(".stat-number");

const animateCounters = () => {
    counters.forEach(counter => {
        const target = +counter.dataset.target;
        const speed = 100;

        const update = () => {
            const current = +counter.innerText || 0;
            const increment = Math.ceil(target / speed);

            if (current < target) {
                counter.innerText = current + increment;
                requestAnimationFrame(update);
            } else {
                counter.innerText = target;
            }
        };

        update();
    });
};

const statsSection = document.querySelector(".entrance-stats");

if (statsSection) {
    const statsObserver = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            animateCounters();
            statsObserver.disconnect();
        }
    });

    statsObserver.observe(statsSection);
}

// ===== BURGER MENU =====
const burger = document.querySelector(".burger");
const menu = document.querySelector(".menu");

if (burger && menu) {
    burger.addEventListener("click", () => {
        menu.classList.toggle("active");
    });
}

// ===== FOOTER TOGGLE =====
const toggle = document.querySelector(".footer-toggle");
const footerLinks = document.querySelector(".footer-links");

if (toggle && footerLinks) {
    toggle.addEventListener("click", () => {
        toggle.classList.toggle("active");
        footerLinks.classList.toggle("active");
    });
}

// ===== SCROLL TO TOP =====
const scrollBtn = document.getElementById("scrollTopBtn");

if (scrollBtn) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            scrollBtn.classList.add("show");
        } else {
            scrollBtn.classList.remove("show");
        }
    });

    scrollBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

// ===== FADE-IN OBSERVER =====
const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }
    });
}, {
    threshold: 0.15
});

document.querySelectorAll(".fade-in").forEach(el => {
    fadeObserver.observe(el);
});

// ===== PHONE CONFIRM =====
function confirmCall(number) {
    if (confirm("გსურთ დარეკვა?")) {
        window.location.href = "tel:" + number;
    }
}
window.confirmCall = confirmCall;

// ===== ADMIN EMAILS =====
const adminEmails = [
    "nanukakupreishvili4@gmail.com"
];

// ===== ADMIN DROPDOWN VISIBILITY =====
onAuthStateChanged(auth, user => {
    const adminDropdown = document.getElementById("adminDropdown");
    if (!adminDropdown) return;

    if (user && adminEmails.includes(user.email)) {
        adminDropdown.style.display = "flex";
    } else {
        adminDropdown.style.display = "none";
    }
});

// ===== HELPERS =====
function parseDateValue(dateString) {
    if (!dateString) return 0;

    const parsed = new Date(dateString);
    if (!Number.isNaN(parsed.getTime())) return parsed.getTime();

    return 0;
}

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

function shuffleArray(array) {
    const arr = [...array];

    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
}

function createDeleteButton() {
    const btn = document.createElement("button");
    btn.className = "news-delete-btn";
    btn.type = "button";
    btn.textContent = "წაშლა";
    return btn;
}

// ===== NEWS BUILDERS =====
function buildHomeNewsCard(data, id) {
    const article = document.createElement("article");
    const imageUrl = data.image || data.imageUrl || data.img || data.photo || "";

    article.className = "home-news-card";
    article.dataset.id = id;
    article.dataset.image = imageUrl;

    const imagePart = imageUrl
        ? `
            <div class="home-news-image-wrap">
                <div
                    class="home-news-image"
                    style="background-image: url('${imageUrl}');
                           background-size: cover;
                           background-position: center;
                           background-repeat: no-repeat;">
                </div>
            </div>
        `
        : `
            <div class="home-news-image-wrap no-image">
                <div class="home-news-image-placeholder">ფოტო არ არის</div>
            </div>
        `;

    article.innerHTML = `
        ${imagePart}
        <div class="home-news-content">
            <p class="home-news-date">${data.date || ""}</p>
            <h3 class="home-news-title">${data.title || ""}</h3>
            <p class="home-news-description">${data.description || ""}</p>
            <a href="other-pages/news.html" class="home-news-more">ვრცლად</a>
        </div>
    `;
    console.log("image url:", imageUrl);
    return article;
}

function buildNewsCard(data, id) {
    const article = document.createElement("article");
    article.className = "news-card";
    article.dataset.id = id;
    article.dataset.image = data.image || "";

    article.innerHTML = `
        <div class="news-content">
            <div class="news-title-wrapper">
                <h2 class="news-title">${data.title || ""}</h2>
            </div>

            <div class="news-description-wrapper">
                <p class="news-description">${data.description || ""}</p>
            </div>

            <div class="news-date-wrapper">
                <p class="news-date">${data.date || ""}</p>
            </div>
        </div>

        <div
            class="news-image"
            style="background-image: url('${data.image || ""}');
                   background-size: cover;
                   background-position: center;
                   background-repeat: no-repeat;">
        </div>
    `;

    if (deleteMode) {
        article.style.position = "relative";
        article.appendChild(createDeleteButton());
    }

    return article;
}

// ===== HOME PAGE NEWS SLIDER FROM DATABASE =====
const homeNewsContainer = document.querySelector(".news-cards");

function initHomeNewsSlider(container) {
    if (!container || typeof $ === "undefined") return;

    if ($(container).hasClass("slick-initialized")) {
        $(container).slick("unslick");
    }

    $(container).slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        arrows: false,
        infinite: true,
        dots: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: { slidesToShow: 2 }
            },
            {
                breakpoint: 768,
                settings: { slidesToShow: 1 }
            }
        ]
    });
}

if (homeNewsContainer) {
    const homeNewsRef = dbRef(db, "news");

    onValue(homeNewsRef, snapshot => {
        const data = snapshot.val() || {};

        const items = Object.entries(data).map(([id, value]) => ({
            id,
            ...value
        }));

        items.sort((a, b) => parseDateValue(b.date) - parseDateValue(a.date));

        const latestTen = items.slice(0, 10);
        const randomizedLatestTen = shuffleArray(latestTen);

        homeNewsContainer.innerHTML = "";

        randomizedLatestTen.forEach(item => {
            const card = buildHomeNewsCard(item, item.id);
            homeNewsContainer.appendChild(card);
        });

        setTimeout(() => {
            initHomeNewsSlider(homeNewsContainer);
        }, 50);
    }, error => {
        console.error("Home realtime news load error:", error);
    });
}

// ===== HOME PAGE CLUBS FROM WREEBI =====
const circlesContainer = document.querySelector(".circles-container");

function initClubsSlider(container) {
    if (!container || typeof $ === "undefined") return;
    if (!container.children.length) return;

    if ($(container).hasClass("slick-initialized")) {
        $(container).slick("unslick");
    }

    $(container).slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2200,
        arrows: false,
        infinite: true,
        dots: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: { slidesToShow: 2 }
            },
            {
                breakpoint: 768,
                settings: { slidesToShow: 1 }
            }
        ]
    });
}

function loadHomeClubs() {
    if (!circlesContainer) return;

    fetch("other-pages/studying-process/wreebi.html")
        .then(res => {
            if (!res.ok) {
                throw new Error(`Failed to fetch wreebi.html: ${res.status}`);
            }
            return res.text();
        })
        .then(data => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, "text/html");
            const clubItems = doc.querySelectorAll(".circle-item");

            circlesContainer.innerHTML = "";

            if (!clubItems.length) {
                circlesContainer.innerHTML = "<p>კლუბები ვერ მოიძებნა</p>";
                return;
            }

            clubItems.forEach(item => {
                circlesContainer.appendChild(item.cloneNode(true));
            });

            setTimeout(() => {
                initClubsSlider(circlesContainer);
            }, 50);
        })
        .catch(err => {
            console.error("Clubs load error:", err);
            circlesContainer.innerHTML = "<p>კლუბების ჩატვირთვა ვერ მოხერხდა</p>";
        });
}

if (circlesContainer) {
    loadHomeClubs();
}

// ===== NEWS PAGE RENDER =====
const newsContainer = document.getElementById("newsContainer");

if (newsContainer) {
    const newsRef = dbRef(db, "news");

    onValue(newsRef, snapshot => {
        const data = snapshot.val() || {};

        const items = Object.entries(data).map(([id, value]) => ({
            id,
            ...value
        }));

        items.sort((a, b) => parseDateValue(b.date) - parseDateValue(a.date));

        newsContainer.innerHTML = "";

        items.forEach(item => {
            const card = buildNewsCard(item, item.id);
            newsContainer.appendChild(card);
        });

        console.log("news rendered:", items.length);
    }, error => {
        console.error("Realtime news load error:", error);
    });
}

// ===== DELETE MODE =====
const deleteBtn = document.getElementById("delete-news-btn");

if (deleteBtn) {
    deleteBtn.addEventListener("click", e => {
        e.preventDefault();
        deleteMode = !deleteMode;

        document.querySelectorAll(".news-card").forEach(card => {
            let btn = card.querySelector(".news-delete-btn");

            if (deleteMode) {
                if (!btn) {
                    btn = createDeleteButton();
                    card.style.position = "relative";
                    card.appendChild(btn);
                }
            } else {
                if (btn) btn.remove();
            }
        });
    });
}

// ===== DELETE ACTION =====
document.addEventListener("click", async e => {
    const deleteButton = e.target.closest(".news-delete-btn");
    if (!deleteButton) return;

    const card = deleteButton.closest(".news-card");
    if (!card) return;

    const user = auth.currentUser;

    if (!user || !adminEmails.includes(user.email)) {
        alert("არ გაქვს წაშლის უფლება");
        return;
    }

    const newsId = card.dataset.id;
    const imageUrl = card.dataset.image;

    if (!newsId) {
        console.error("No ID found");
        return;
    }

    if (!confirm("დარწმუნებული ხარ რომ გინდა წაშლა?")) return;

    try {
        if (imageUrl) {
            try {
                const path = getStoragePathFromUrl(imageUrl);

                if (path) {
                    const imgRef = storageRef(storage, path);
                    await deleteObject(imgRef);
                }
            } catch (err) {
                console.warn("image delete failed:", err);
            }
        }

        await remove(dbRef(db, `news/${newsId}`));
    } catch (error) {
        console.error("❌ delete error:", error);
        alert("შეცდომა წაშლის დროს");
    }
});

// ===== PAGE LOADER =====
window.addEventListener("load", () => {
    const loader = document.getElementById("pageLoader");
    if (!loader) return;

    setTimeout(() => {
        loader.classList.add("hide");
    }, 300);
});

// ===== EMAILJS =====
(function () {
    if (typeof emailjs !== "undefined") {
        emailjs.init("1P6ddswelR4QKXOgA");
    }
})();

const form = document.getElementById("contactForm");

if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("name")?.value.trim();
        const email = document.getElementById("email")?.value.trim();
        const subject = document.getElementById("subject")?.value.trim();
        const message = document.getElementById("message")?.value.trim();

        if (!name || !email || !subject || !message) {
            alert("გთხოვ შეავსე ყველა ველი");
            return;
        }

        const templateParams = {
            name,
            email,
            subject,
            message
        };

        emailjs.send(
            "service_b4n51sl",
            "template_8nfs1up",
            templateParams
        )
        .then(function () {
            alert("შეტყობინება წარმატებით გაიგზავნა!");
            form.reset();
        })
        .catch(function (error) {
            console.error("❌ email error:", error);
            alert("გაგზავნა ვერ მოხერხდა. შეამოწმე EmailJS template fields.");
        });
    });
}

// ===== DATE LIMIT FOR NEWS FORM =====
const dateInput = document.getElementById("newsDate");
const newsForm = document.getElementById("newsForm");

if (dateInput) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const todayString = `${year}-${month}-${day}`;
    const minDate = `${year}-01-01`;
    const maxDate = todayString;

    dateInput.min = minDate;
    dateInput.max = maxDate;

    if (!dateInput.value) {
        dateInput.value = todayString;
    }

    dateInput.addEventListener("change", () => {
        if (dateInput.value < minDate) {
            alert("შეგიძლია აირჩიო მხოლოდ მიმდინარე წლის თარიღი.");
            dateInput.value = todayString;
        }

        if (dateInput.value > maxDate) {
            alert("მომავალი თარიღის არჩევა არ შეიძლება.");
            dateInput.value = todayString;
        }
    });

    if (newsForm) {
        newsForm.addEventListener("submit", e => {
            const selectedDate = dateInput.value;

            if (selectedDate < minDate || selectedDate > maxDate) {
                e.preventDefault();
                alert("თარიღი უნდა იყოს მხოლოდ მიმდინარე წლის ფარგლებში და არ უნდა იყოს მომავალში.");
                dateInput.value = todayString;
            }
        });
    }
}

const historyPoints = document.querySelectorAll(".history-point");
const historyPanels = document.querySelectorAll(".history-panel");

historyPoints.forEach(point => {
    point.addEventListener("click", () => {
        const targetId = point.dataset.target;

        historyPoints.forEach(item => item.classList.remove("active"));
        historyPanels.forEach(panel => panel.classList.remove("active"));

        point.classList.add("active");
        document.getElementById(targetId).classList.add("active");
    });
});