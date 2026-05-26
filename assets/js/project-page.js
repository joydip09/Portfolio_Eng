/* ============================================================
   PROJECT-PAGE.JS — Per-Project Interactions
   ============================================================ */

'use strict';

// ----------------------------------------
// READING PROGRESS BAR
// ----------------------------------------

(function initReadingProgress() {
  const bar = document.querySelector('#reading-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop    = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const progress     = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width    = `${Math.min(progress, 100)}%`;
  }, { passive: true });
})();

// ----------------------------------------
// GALLERY LIGHTBOX
// ----------------------------------------

(function initLightbox() {
  const gallery = document.querySelector('.gallery');
  if (!gallery) return;

  // Create lightbox
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `
    <div class="lightbox__backdrop"></div>
    <div class="lightbox__box">
      <button class="lightbox__close" aria-label="Close">✕</button>
      <button class="lightbox__prev" aria-label="Previous">‹</button>
      <button class="lightbox__next" aria-label="Next">›</button>
      <img class="lightbox__img" src="" alt="">
      <p class="lightbox__caption"></p>
    </div>
  `;
  document.body.appendChild(lb);

  const img     = lb.querySelector('.lightbox__img');
  const caption = lb.querySelector('.lightbox__caption');
  const items   = gallery.querySelectorAll('.gallery__item img');
  let current   = 0;

  function show(index) {
    current = (index + items.length) % items.length;
    const src = items[current].src;
    const alt = items[current].alt;
    img.src     = src;
    img.alt     = alt;
    caption.textContent = alt;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  items.forEach((item, i) => {
    item.closest('.gallery__item').style.cursor = 'zoom-in';
    item.closest('.gallery__item').addEventListener('click', () => show(i));
  });

  lb.querySelector('.lightbox__close').addEventListener('click', close);
  lb.querySelector('.lightbox__backdrop').addEventListener('click', close);
  lb.querySelector('.lightbox__prev').addEventListener('click', () => show(current - 1));
  lb.querySelector('.lightbox__next').addEventListener('click', () => show(current + 1));

  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
})();

// ----------------------------------------
// LIGHTBOX STYLES (injected)
// ----------------------------------------

(function injectLightboxStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .lightbox {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: none;
      align-items: center;
      justify-content: center;
    }
    .lightbox.open { display: flex; }
    .lightbox__backdrop {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.9);
    }
    .lightbox__box {
      position: relative;
      max-width: 90vw;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }
    .lightbox__img {
      max-width: 100%;
      max-height: 80vh;
      border-radius: 8px;
      object-fit: contain;
    }
    .lightbox__caption {
      color: rgba(255,255,255,0.6);
      font-size: 0.8rem;
      text-align: center;
    }
    .lightbox__close {
      position: absolute;
      top: -40px;
      right: 0;
      color: #fff;
      font-size: 1.5rem;
      cursor: pointer;
      background: none;
      border: none;
      opacity: 0.7;
      transition: opacity 0.15s;
    }
    .lightbox__close:hover { opacity: 1; }
    .lightbox__prev, .lightbox__next {
      position: fixed;
      top: 50%;
      transform: translateY(-50%);
      color: #fff;
      font-size: 2.5rem;
      cursor: pointer;
      background: rgba(255,255,255,0.08);
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      transition: background 0.15s;
    }
    .lightbox__prev:hover, .lightbox__next:hover { background: rgba(255,255,255,0.16); }
    .lightbox__prev { left: 16px; }
    .lightbox__next { right: 16px; }
  `;
  document.head.appendChild(style);
})();

// ----------------------------------------
// COLLAPSIBLE SECTIONS
// ----------------------------------------

(function initCollapsible() {
  document.querySelectorAll('.collapsible__toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const parent = toggle.closest('.collapsible');
      const body   = parent?.querySelector('.collapsible__body');
      if (!body) return;

      const isOpen = parent.classList.toggle('open');
      body.style.maxHeight = isOpen ? body.scrollHeight + 'px' : '0';
      toggle.querySelector('.collapsible__icon').textContent = isOpen ? '−' : '+';
    });
  });
})();

// ----------------------------------------
// TABS
// ----------------------------------------

(function initTabs() {
  document.querySelectorAll('.tabs').forEach(tabs => {
    const btns    = tabs.querySelectorAll('.tab-btn');
    const panels  = tabs.querySelectorAll('.tab-panel');

    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        btns.forEach(b  => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        tabs.querySelector(`[data-panel="${target}"]`)?.classList.add('active');
      });
    });
  });
})();
