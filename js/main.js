/* ===================================================================
   Joint Insights — Interactive Behavior (Hamburger Menu & Smooth Scroll)
   =================================================================== */

(function () {
  "use strict";

  /* ---- Hamburger toggle for mobile nav ---- */
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navList = document.querySelector(".nav-list");
  if (header && navToggle) {
    navToggle.addEventListener("click", function () {
      const isOpen = header.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    /* Close menu when a mobile link is clicked */
    var mobileLinks = document.querySelectorAll(".nav-list a");
    for (var i = 0; i < mobileLinks.length; i++) {
      mobileLinks[i].addEventListener("click", function () {
        if (window.innerWidth <= 820) {
          header.classList.remove("is-open");
          navToggle.setAttribute("aria-expanded", "false");
        }
      });
    }

    /* Close menu when window is resized past breakpoint */
    window.addEventListener("resize", function () {
      if (window.innerWidth > 820) {
        header.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---- Smooth scroll for all anchor links (fallback for older browsers) ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    var targetId = anchor.getAttribute("href");
    if (!targetId || targetId === "#") return;
    var targetEl = document.querySelector(targetId);
    if (targetEl) {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        window.scrollTo({ top: targetEl.offsetTop - 80, behavior: "smooth" });
        /* Close mobile menu if open */
        if (header && window.innerWidth <= 820) {
          header.classList.remove("is-open");
          navToggle.setAttribute("aria-expanded", "false");
        }
      });
    }
  });

  /* ---- Highlight active link based on current URL section ---- */
  var links = document.querySelectorAll(".nav-list a[href]");
  if (links.length) {
    var currentPage = window.location.pathname.replace(/\/$/, "") || "/";
    for (var i = 0; i < links.length; i++) {
      var linkPath = links[i].getAttribute("href").replace(/\/$/, "") || "/";
      if ((linkPath === "/" && currentPage === "/") || (linkPath !== "/" && currentPage.indexOf(linkPath) === 0)) {
        links[i].classList.add("active");
      }
    }
  };
})();

/* ===================================================================
   Testimonials Carousel
   =================================================================== */
(function () {
  "use strict";

    function initCarousel(carousel) {
    var slides = carousel.querySelectorAll(".testimonial-card");
    if (slides.length <= 1) return; // fall back to grid — no rotation needed

    let current = Math.floor(Math.random() * slides.length);

    function show(n) {
      current = (n + slides.length) % slides.length;
      for (var i = 0; i < slides.length; i++) {
        var active = i === current;
        slides[i].classList.toggle("is-active", active);
        var dot = carousel.querySelector('.carousel-dot[data-index="' + i + '"]');
                if (dot) dot.classList.toggle('is-active', active);
      }
    }

    carousel.querySelector(".carousel-arrow--prev").addEventListener("click", function () { show(current - 1); });
    carousel.querySelector(".carousel-arrow--next").addEventListener("click", function () { show(current + 1); });

    show(current); // random start — sync dots

    /* ---- Touch / swipe support (touch devices only) ---- */
    if ('ontouchstart' in window) {
      var vp = carousel.querySelector('.testimonial-carousel__viewport');
      var startX = 0;

      vp.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });

      vp.addEventListener('touchend', function (e) {
        var deltaX = startX - e.changedTouches[0].clientX;
        if (Math.abs(deltaX) < 50) return;            // not enough distance to count as a swipe
        show(current + (deltaX > 0 ? 1 : -1));         // left-swipe → next, right-swipe → prev
      });

      vp.addEventListener('touchmove', function (e) {
        var touchDelta = Math.abs(e.touches[0].clientX - startX);
        if (e.deltaY * touchDelta < 20 && e.cancelable) {                // clearly a horizontal gesture → block vertical scroll only on the carousel
          e.preventDefault();
        }
      }, { passive: false });
    }

    carousel.querySelectorAll(".carousel-dot").forEach(function (dot) {
      dot.addEventListener("click", function () { show(+this.dataset.index); });
    });
  }

  document.querySelectorAll(".testimonial-carousel").forEach(initCarousel);
})();
