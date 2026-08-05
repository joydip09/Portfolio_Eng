/* ============================================================
   PROJECTS.JS — Dynamic Feed + Filtering
   ============================================================ */

"use strict";

// ----------------------------------------
// LOAD + RENDER PROJECT CARDS
// ----------------------------------------

async function loadProjects() {
  const feed = document.querySelector("#project-feed");
  const featured = document.querySelector("#featured-grid");
  if (!feed && !featured) return;

  let projects = [];
  try {
    const projectsJsonPath = location.pathname.includes("/projects/")
      ? "../data/projects.json"
      : "data/projects.json";

    const res = await fetch(projectsJsonPath);
    projects = await res.json();
  } catch (err) {
    console.warn("Could not load projects.json:", err);
    return;
  }

  if (featured) {
    const featuredProjects = projects.filter((p) => p.featured).slice(0, 4);
    featured.innerHTML = featuredProjects.map(renderCard).join("");
  }

  if (feed) {
    feed.innerHTML = projects.map(renderCard).join("");
    initFilters(projects);
  }

  // Trigger reveal on newly inserted cards
  document.querySelectorAll(".project-card").forEach((card, i) => {
    card.classList.add("reveal");
    card.dataset.delay = i * 60;
  });

  // Re-run reveal observer for new elements
  triggerReveal();

  if (featured) {
    initFeaturedCarousel();
  }
}

// ----------------------------------------
// RENDER A SINGLE CARD
// ----------------------------------------

function renderCard(p) {
  const pagePrefix = location.pathname.includes("/projects/") ? "../" : "";

  const tags = (p.tags || [])
    .map((t) => `<span class="tag">${t}</span>`)
    .join("");

  const badge = p.status
    ? `<span class="badge badge--${statusClass(p.status)} project-card__badge">${p.status}</span>`
    : "";

  const dots = renderDots(p.difficulty || 1);

  const thumb = p.thumbnail
    ? `<img src="${pagePrefix}${p.thumbnail}" alt="${p.title}" loading="lazy">`
    : `<div class="project-card__thumb--placeholder">⚙️</div>`;

  return `
    <a href="${p.url ? pagePrefix + p.url : "#"}" class="project-card__link">
      <article class="project-card" data-tags='${JSON.stringify(p.tags || [])}' data-status="${p.status || ""}">
        <div class="project-card__thumb">
          ${thumb}
          ${badge}
        </div>
        <div class="project-card__body">
          <h3 class="project-card__title">${p.title}</h3>
          <p class="project-card__desc">${p.description || ""}</p>
          <div class="tags-row">${tags}</div>
          <div class="project-card__meta">
            <span class="difficulty">${dots}<span>${diffLabel(p.difficulty || 1)}</span></span>
            <span>${p.date ? formatDate(p.date) : ""}</span>
          </div>
        </div>
      </article>
    </a>
  `;
}

function statusClass(status) {
  const map = {
    Completed: "completed",
    "In Progress": "progress",
    Prototype: "prototype",
    Experimental: "experimental",
    Archived: "archived",
  };
  return map[status] || "prototype";
}

function renderDots(level) {
  const total = 5;
  let html = '<span class="difficulty__dots">';
  for (let i = 1; i <= total; i++) {
    html += `<span class="difficulty__dot${i <= level ? " difficulty__dot--active" : ""}"></span>`;
  }
  html += "</span>";
  return html;
}

function diffLabel(level) {
  const labels = ["", "Beginner", "Easy", "Intermediate", "Advanced", "Expert"];
  return labels[Math.min(level, 5)] || "Intermediate";
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

// ----------------------------------------
// FILTER SYSTEM
// ----------------------------------------

function initFilters(projects) {
  const filterBar = document.querySelector("#filter-bar");
  const feed = document.querySelector("#project-feed");
  if (!filterBar || !feed) return;

  // Collect all unique tags
  const allTags = ["All", ...new Set(projects.flatMap((p) => p.tags || []))];

  filterBar.innerHTML = allTags
    .map(
      (tag, i) => `
    <button class="filter-btn${i === 0 ? " active" : ""}" data-filter="${tag}">${tag}</button>
  `,
    )
    .join("");

  let activeFilter = "All";

  filterBar.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;

    activeFilter = btn.dataset.filter;
    filterBar
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const cards = feed.querySelectorAll(".project-card");
    cards.forEach((card) => {
      const tags = JSON.parse(card.dataset.tags || "[]");
      const show = activeFilter === "All" || tags.includes(activeFilter);
      card.closest("a").classList.toggle("hidden", !show);
    });
  });
}

// ----------------------------------------
// TRIGGER REVEAL OBSERVER
// ----------------------------------------

function triggerReveal() {
  const reveals = document.querySelectorAll(".reveal:not(.visible)");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(
            () => entry.target.classList.add("visible"),
            Number(delay),
          );
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -30px 0px" },
  );

  reveals.forEach((el) => observer.observe(el));
}

function initFeaturedCarousel() {
  const track = document.querySelector(".featured__track");
  const prevBtn = document.querySelector(".carousel__nav--prev");
  const nextBtn = document.querySelector(".carousel__nav--next");
  if (!track || !prevBtn || !nextBtn) return;

  const gap = parseFloat(getComputedStyle(track).gap) || 24;
  const getScrollAmount = () => {
    const card = track.querySelector(".project-card");
    return card
      ? card.getBoundingClientRect().width + gap
      : track.clientWidth * 0.8;
  };

  prevBtn.addEventListener("click", () => {
    track.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
  });

  nextBtn.addEventListener("click", () => {
    track.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
  });
}

// ----------------------------------------
// INIT
// ----------------------------------------

document.addEventListener("DOMContentLoaded", loadProjects);
