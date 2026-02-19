// ===== HEADER SHOW/HIDE ON SCROLL & HOVER =====
const header = document.querySelector(".main-navbar");
const hoverZone = document.querySelector(".header-hover-zone");
let lastScrollY = window.scrollY;
let hideTimeout;

const showHeader = () => {
  header.classList.remove("hide");
  clearTimeout(hideTimeout);
};

const hideHeaderDelayed = () => {
  if (window.scrollY <= 0) return;
  hideTimeout = setTimeout(() => header.classList.add("hide"), 2000);
};

// Scroll behavior
window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY;

  if (currentScroll <= 0) {
    header.classList.remove("hide");
    lastScrollY = 0;
    return;
  }

  if (currentScroll > lastScrollY) {
    header.classList.add("hide"); // scrolling down
  } else if (currentScroll < lastScrollY) {
    header.classList.remove("hide"); // scrolling up
  }

  lastScrollY = currentScroll;
});

// Hover behavior
[hoverZone, header].forEach(el => {
  el.addEventListener("mouseenter", showHeader);
});
header.addEventListener("mouseleave", hideHeaderDelayed);

// ===== STAT COUNTERS =====
const counters = document.querySelectorAll(".stat-number");

const animateCounters = () => {
  counters.forEach(counter => {
    const target = +counter.dataset.target;
    const speed = 100; // smaller = faster

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

// Trigger animation when section appears
const statsSection = document.querySelector(".entrance-stats");
if (statsSection) {
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animateCounters();
      observer.disconnect();
    }
  });
  observer.observe(statsSection);
}

// ===== NEWS CARDS SLICK SLIDER =====
fetch('../../other-pages/news-cards.html')
  .then(res => res.text())
  .then(data => {
    const container = document.querySelector('.news-cards');
    container.innerHTML = data;

    setTimeout(() => {
      if ($(container).hasClass('slick-initialized')) $(container).slick('unslick');

      $(container).slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        arrows: false,
        infinite: true,
        dots: true,
        responsive: [
          { breakpoint: 1024, settings: { slidesToShow: 2 } },
          { breakpoint: 768, settings: { slidesToShow: 1 } }
        ]
      });
    }, 50); // slight delay
  })
  .catch(console.error);

// ===== BURGER MENU =====
const burger = document.querySelector(".burger");
const menu = document.querySelector(".menu");

if (burger && menu) {
  burger.addEventListener("click", () => menu.classList.toggle("active"));
}

// ===== FOOTER TOGGLE =====
const toggle = document.querySelector(".footer-toggle");
const footerLinks = document.querySelector(".footer-links");

if (toggle && footerLinks) {
  toggle.addEventListener("click", () => {
    toggle.classList.toggle("active");       // rotate arrow
    footerLinks.classList.toggle("active");  // show/hide links
  });
}


const scrollBtn = document.getElementById("scrollTopBtn");

// show button when scrolling down
window.addEventListener("scroll", () => {

    if (window.scrollY > 300) {
        scrollBtn.classList.add("show");
    } else {
        scrollBtn.classList.remove("show");
    }

});

// scroll to top when clicked
scrollBtn.addEventListener("click", () => {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");

        }

    });

}, {
    threshold: 0.15
});


document.querySelectorAll(".fade-in").forEach(el => {

    observer.observe(el);

});
