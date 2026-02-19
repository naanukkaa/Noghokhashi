const header = document.querySelector(".main-navbar");
const hoverZone = document.querySelector(".header-hover-zone");
let lastScrollY = window.scrollY;
let hideTimeout;

// Scroll behavior
window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY;

  // Always show if at top
  if (currentScroll <= 0) {
    header.classList.remove("hide");
    lastScrollY = 0;
    return;
  }

  if (currentScroll > lastScrollY) {
    // Scroll down → hide
    header.classList.add("hide");
  } else if (currentScroll < lastScrollY) {
    // Scroll up → show
    header.classList.remove("hide");
  }

  lastScrollY = currentScroll;
});

// Hover behavior — only matters if header is hidden
const showHeader = () => {
  if (!header.classList.contains("hide")) return; // do nothing if already visible
  header.classList.remove("hide");
  clearTimeout(hideTimeout);
};

const hideHeaderDelayed = () => {
  if (window.scrollY <= 0) return; // never hide if at top
  hideTimeout = setTimeout(() => {
    header.classList.add("hide");
  }, 2000); // 2s delay
};

// Trigger hover only when header is hidden from scroll
hoverZone.addEventListener("mouseenter", showHeader);
header.addEventListener("mouseenter", showHeader);
header.addEventListener("mouseleave", hideHeaderDelayed);



const counters = document.querySelectorAll(".stat-number");

const animateCounters = () => {
  counters.forEach(counter => {
    const target = +counter.getAttribute("data-target");
    const speed = 100; // smaller = faster

    const updateCount = () => {
      const current = +counter.innerText;
      const increment = Math.ceil(target / speed);

      if (current < target) {
        counter.innerText = current + increment;
        setTimeout(updateCount, 20);
      } else {
        counter.innerText = target;
      }
    };

    updateCount();
  });
};

// Run animation when section appears on screen
const statsSection = document.querySelector(".entrance-stats");

const observer = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    animateCounters();
    observer.disconnect(); // run only once
  }
});

observer.observe(statsSection);

fetch('../../other-pages/news-cards.html')
  .then(res => res.text())
  .then(data => {
      const container = document.querySelector('.news-cards');
      container.innerHTML = data;

      // wait for browser to render inserted HTML
      setTimeout(() => {

          // destroy if already initialized (prevents duplication bug)
          if ($(container).hasClass('slick-initialized')) {
              $(container).slick('unslick');
          }

          $(container).slick({
              slidesToShow: 4,
              slidesToScroll: 1,
              autoplay: true,
              autoplaySpeed: 2000,
              arrows: true,
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

      }, 100); // small delay is critical
  })
  .catch(err => console.error(err));


const burger = document.querySelector(".burger");
const menu = document.querySelector(".menu");

burger.addEventListener("click", () => {

menu.classList.toggle("active");

});



const toggle = document.querySelector(".footer-toggle");
const footerLinks = document.querySelector(".footer-links");

toggle.addEventListener("click", () => {

footerLinks.classList.toggle("active");

});
