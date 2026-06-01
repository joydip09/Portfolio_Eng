/* ============================================================
   MAIN.JS — Global Scripts
   ============================================================ */

"use strict";

// ----------------------------------------
// NAVBAR — Scroll + Mobile Toggle
// ----------------------------------------

(function initNav() {
  const nav = document.querySelector(".nav");
  const hamburger = document.querySelector(".nav__hamburger");
  const mobileMenu = document.querySelector(".nav__mobile");
  const navLinks = document.querySelectorAll(".nav__link");

  // Scroll class
  if (nav) {
    window.addEventListener(
      "scroll",
      () => {
        nav.classList.toggle("scrolled", window.scrollY > 20);
      },
      { passive: true },
    );
  }

  // Mobile toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      const open = hamburger.classList.toggle("open");
      mobileMenu.classList.toggle("open", open);
      document.body.style.overflow = open ? "hidden" : "";
    });
  }

  // Active link highlighting
  const currentPath = window.location.pathname;
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href && currentPath.includes(href) && href !== "/") {
      link.classList.add("active");
    }
    if (href === "/" || href === "/index.html") {
      if (currentPath === "/" || currentPath === "/index.html") {
        link.classList.add("active");
      }
    }
  });

  // Close mobile menu on link click
  document.querySelectorAll(".nav__mobile .nav__link").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger?.classList.remove("open");
      mobileMenu?.classList.remove("open");
      document.body.style.overflow = "";
    });
  });
})();

// ----------------------------------------
// AUTO STAGGER — Reveal children
// ----------------------------------------

(function initStagger() {
  const staggerGroups = document.querySelectorAll("[data-stagger]");

  staggerGroups.forEach((group) => {
    const children = group.children;
    Array.from(children).forEach((child, i) => {
      child.classList.add("reveal");
      child.dataset.delay = i * 80;
    });
  });
})();

// ----------------------------------------
// REVEAL ON SCROLL — Intersection Observer
// ----------------------------------------

(function initReveal() {
  const reveals = document.querySelectorAll(".reveal");
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger children if there are multiple
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, Number(delay));
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );

  reveals.forEach((el) => observer.observe(el));
})();

// ----------------------------------------
// COPY CODE
// ----------------------------------------

(function initCopyCode() {
  document.querySelectorAll(".code-block__copy").forEach((btn) => {
    btn.addEventListener("click", () => {
      const pre = btn.closest(".code-block")?.querySelector("pre");
      if (!pre) return;
      navigator.clipboard.writeText(pre.textContent.trim()).then(() => {
        const orig = btn.textContent;
        btn.textContent = "✓ Copied";
        setTimeout(() => {
          btn.textContent = orig;
        }, 2000);
      });
    });
  });
})();

// ----------------------------------------
// SMOOTH ANCHOR SCROLL
// ----------------------------------------

(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const href = anchor.getAttribute("href");
      if (href === "#") return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navH =
          parseInt(
            getComputedStyle(document.documentElement).getPropertyValue(
              "--nav-height",
            ),
            10,
          ) || 68;
        const top =
          target.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });
})();

// ----------------------------------------
// ACTIVE SECTION ON SCROLL — update nav link for anchored sections
// ----------------------------------------

(function initActiveOnScroll() {
  const navLinks = Array.from(
    document.querySelectorAll('.nav__link[href*="#"]'),
  );
  if (!navLinks.length) return;

  // map sections to their corresponding nav link
  const sections = navLinks
    .map((link) => {
      const href = link.getAttribute("href");
      const hashIdx = href.indexOf("#");
      if (hashIdx === -1) return null;
      const id = href.slice(hashIdx);
      const el = document.querySelector(id);
      return el ? { el, link } : null;
    })
    .filter(Boolean);

  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      // pick the most-visible intersecting section to mark active
      const intersecting = entries.filter((e) => e.isIntersecting);
      if (intersecting.length) {
        let best = intersecting[0];
        intersecting.forEach((e) => {
          if (e.intersectionRatio > best.intersectionRatio) best = e;
        });
        const match = sections.find((s) => s.el === best.target);
        if (match) {
          document
            .querySelectorAll(".nav__link.active")
            .forEach((l) => l.classList.remove("active"));
          match.link.classList.add("active");
        }
        return;
      }

      // if no anchored section visible, revert active state based on pathname
      const currentPath = window.location.pathname;
      document.querySelectorAll(".nav__link").forEach((link) => {
        const href = link.getAttribute("href");
        if (!href) return;
        if (
          (href === "/" || href === "/index.html") &&
          (currentPath === "/" || currentPath === "/index.html")
        ) {
          link.classList.add("active");
          return;
        }
        if (
          href !== "/" &&
          href !== "/index.html" &&
          currentPath.includes(href)
        ) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    },
    { threshold: 0.55, rootMargin: "0px 0px -20% 0px" },
  );

  sections.forEach((s) => observer.observe(s.el));
})();

// ----------------------------------------
// HERO PARTICLES
// ----------------------------------------

(function initHeroParticles() {
  const container = document.querySelector(".hero__particles");
  if (!container) return;

  const COLORS = ["#008080", "#3EB489", "#4A90E2"];
  const COUNT = 18;

  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement("span");
    p.className = "hero__particle";

    const size = Math.random() * 6 + 3;
    const x = Math.random() * 100;
    const y = Math.random() * 80 + 10;
    const dur = Math.random() * 8 + 8;
    const del = Math.random() * 12;
    const clr = COLORS[Math.floor(Math.random() * COLORS.length)];

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}%;
      top: ${y}%;
      background: ${clr};
      animation-duration: ${dur}s;
      animation-delay: ${del}s;
      opacity: 0;
    `;
    container.appendChild(p);
  }
})();

// ----------------------------------------
// UTILITY: Debounce
// ----------------------------------------

function debounce(fn, wait = 150) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}
