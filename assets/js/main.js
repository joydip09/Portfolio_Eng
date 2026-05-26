/* ============================================================
   MAIN.JS — Global Scripts
   ============================================================ */

'use strict';

// ----------------------------------------
// NAVBAR — Scroll + Mobile Toggle
// ----------------------------------------

(function initNav() {
  const nav        = document.querySelector('.nav');
  const hamburger  = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile');
  const navLinks   = document.querySelectorAll('.nav__link');

  // Scroll class
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // Mobile toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }

  // Active link highlighting
  const currentPath = window.location.pathname;
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.includes(href) && href !== '/') {
      link.classList.add('active');
    }
    if (href === '/' || href === '/index.html') {
      if (currentPath === '/' || currentPath === '/index.html') {
        link.classList.add('active');
      }
    }
  });

  // Close mobile menu on link click
  document.querySelectorAll('.nav__mobile .nav__link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      mobileMenu?.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

// ----------------------------------------
// REVEAL ON SCROLL — Intersection Observer
// ----------------------------------------

(function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children if there are multiple
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, Number(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
})();

// ----------------------------------------
// AUTO STAGGER — Reveal children
// ----------------------------------------

(function initStagger() {
  const staggerGroups = document.querySelectorAll('[data-stagger]');

  staggerGroups.forEach(group => {
    const children = group.children;
    Array.from(children).forEach((child, i) => {
      child.classList.add('reveal');
      child.dataset.delay = i * 80;
    });
  });
})();

// ----------------------------------------
// COPY CODE
// ----------------------------------------

(function initCopyCode() {
  document.querySelectorAll('.code-block__copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const pre = btn.closest('.code-block')?.querySelector('pre');
      if (!pre) return;
      navigator.clipboard.writeText(pre.textContent.trim()).then(() => {
        const orig = btn.textContent;
        btn.textContent = '✓ Copied';
        setTimeout(() => { btn.textContent = orig; }, 2000);
      });
    });
  });
})();

// ----------------------------------------
// SMOOTH ANCHOR SCROLL
// ----------------------------------------

(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10) || 68;
        const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
})();

// ----------------------------------------
// HERO PARTICLES
// ----------------------------------------

(function initHeroParticles() {
  const container = document.querySelector('.hero__particles');
  if (!container) return;

  const COLORS = ['#008080', '#3EB489', '#4A90E2'];
  const COUNT  = 18;

  for (let i = 0; i < COUNT; i++) {
    const p = document.createElement('span');
    p.className = 'hero__particle';

    const size = Math.random() * 6 + 3;
    const x    = Math.random() * 100;
    const y    = Math.random() * 80 + 10;
    const dur  = Math.random() * 8 + 8;
    const del  = Math.random() * 12;
    const clr  = COLORS[Math.floor(Math.random() * COLORS.length)];

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
