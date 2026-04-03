/* ═══════════════════════════════════════════════════════════
   BLOODLINK — mobile.js
   Add this script AFTER script.js in your HTML
═══════════════════════════════════════════════════════════ */

/* ── MOBILE SIDEBAR TOGGLE ────────────────────────────────── */
(function () {

  /* Inject overlay element once */
  const overlay = document.createElement("div");
  overlay.className = "sidebar-overlay";
  overlay.id = "sidebar-overlay";
  overlay.onclick = closeMobileSidebar;
  document.body.appendChild(overlay);

  function openMobileSidebar() {
    const sidebar = document.getElementById("sidebar");
    const hamburger = document.getElementById("hamburger-btn");
    sidebar.classList.add("mobile-open");
    overlay.classList.add("visible");
    if (hamburger) hamburger.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeMobileSidebar() {
    const sidebar = document.getElementById("sidebar");
    const hamburger = document.getElementById("hamburger-btn");
    sidebar.classList.remove("mobile-open");
    overlay.classList.remove("visible");
    if (hamburger) hamburger.classList.remove("open");
    document.body.style.overflow = "";
  }

  /* Close sidebar on nav item click (mobile) */
  function closeSidebarOnNav() {
    if (window.innerWidth <= 1024) {
      closeMobileSidebar();
    }
  }

  /* Inject mobile topbar into each non-landing page */
  function injectMobileTopbar(pageEl) {
    if (!pageEl || pageEl.id === "page-landing") return;
    if (pageEl.querySelector(".mobile-topbar")) return; // already injected

    const bar = document.createElement("div");
    bar.className = "mobile-topbar";
    bar.innerHTML = `
      <div class="mobile-topbar-brand">
        <svg width="22" height="27" viewBox="0 0 60 74" fill="none">
          <path d="M30 4C30 4 6 30 6 46C6 59.2 16.8 70 30 70C43.2 70 54 59.2 54 46C54 30 30 4 30 4Z" fill="#E53935"/>
          <ellipse cx="23" cy="38" rx="5" ry="8" fill="white" opacity="0.28"/>
        </svg>
        BloodLink
      </div>
      <button class="hamburger" id="hamburger-btn" aria-label="Open menu" onclick="window._openMobileSidebar()">
        <span></span><span></span><span></span>
      </button>
    `;

    /* Prepend inside the first child wrapper, or directly */
    const inner = pageEl.querySelector(".page-inner, .form-page-inner, .search-layout");
    if (inner) {
      pageEl.insertBefore(bar, inner);
    } else {
      pageEl.insertBefore(bar, pageEl.firstChild);
    }
  }

  /* Expose globally */
  window._openMobileSidebar  = openMobileSidebar;
  window._closeMobileSidebar = closeMobileSidebar;

  /* Patch the existing navigate() function */
  const _origNavigate = window.navigate;
  window.navigate = function (page) {
    _origNavigate(page);

    if (page !== "landing") {
      /* Inject topbar after navigate renders the page */
      requestAnimationFrame(() => {
        const pageEl = document.getElementById("page-" + page);
        injectMobileTopbar(pageEl);
        /* Re-grab hamburger (freshly injected) and wire it */
        const hb = document.getElementById("hamburger-btn");
        if (hb) hb.onclick = openMobileSidebar;
      });
    }

    /* Close sidebar on any navigation */
    closeSidebarOnNav();
  };

  /* Wire up existing nav-item buttons to close sidebar on mobile */
  document.querySelectorAll(".nav-item").forEach(btn => {
    const orig = btn.onclick;
    btn.addEventListener("click", closeSidebarOnNav);
  });

  /* Close on ESC key */
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeMobileSidebar();
  });

  /* Handle resize — close sidebar if resizing to desktop */
  window.addEventListener("resize", () => {
    if (window.innerWidth > 1024) {
      closeMobileSidebar();
    }
  });

})();
