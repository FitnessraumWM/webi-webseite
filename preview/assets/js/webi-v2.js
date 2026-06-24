(function () {
  const root = document.documentElement;
  const header = document.querySelector("[data-header]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-nav]");
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const themeLabel = document.querySelector("[data-theme-label]");
  const storageKey = "webi-v2-theme";

  function preferredTheme() {
    const stored = localStorage.getItem(storageKey);
    if (stored === "dark" || stored === "light") {
      return stored;
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    if (themeLabel) {
      themeLabel.textContent = theme === "dark" ? "Dunkel" : "Hell";
    }
    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Helle Darstellung aktivieren" : "Dunkle Darstellung aktivieren"
      );
    }
  }

  applyTheme(preferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      localStorage.setItem(storageKey, next);
      applyTheme(next);
    });
  }

  if (menuToggle && header && nav) {
    menuToggle.addEventListener("click", function () {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      header.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("nav-open", !isOpen);
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        menuToggle.setAttribute("aria-expanded", "false");
        header.classList.remove("is-open");
        document.body.classList.remove("nav-open");
      }
    });
  }

  let lastY = window.scrollY;
  let ticking = false;

  function updateHeader() {
    if (!header || header.classList.contains("is-open")) {
      ticking = false;
      return;
    }

    const currentY = window.scrollY;
    const shouldHide = currentY > lastY && currentY > 140;
    header.classList.toggle("is-hidden", shouldHide);
    lastY = Math.max(currentY, 0);
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    },
    { passive: true }
  );

  window.addEventListener("resize", function () {
    if (window.innerWidth > 1120 && header && menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
      header.classList.remove("is-open");
      document.body.classList.remove("nav-open");
    }
  });

  const galleryItems = Array.from(document.querySelectorAll("[data-gallery-src]"));
  const dialog = document.querySelector("[data-photo-dialog]");
  const dialogImage = document.querySelector("[data-gallery-image]");
  const dialogCaption = document.querySelector("[data-gallery-caption]");
  const closeButton = document.querySelector("[data-gallery-close]");
  const prevButton = document.querySelector("[data-gallery-prev]");
  const nextButton = document.querySelector("[data-gallery-next]");
  let activeGalleryIndex = 0;
  let lastFocusedElement = null;

  function setGalleryImage(index) {
    const item = galleryItems[index];
    if (!item || !dialogImage || !dialogCaption) {
      return;
    }

    activeGalleryIndex = index;
    dialogImage.src = item.dataset.gallerySrc;
    dialogImage.alt = item.dataset.galleryAlt || "";
    dialogCaption.textContent = item.dataset.galleryTitle || item.dataset.galleryAlt || "";
  }

  function openGallery(index) {
    if (!dialog || !dialog.showModal) {
      return;
    }

    lastFocusedElement = document.activeElement;
    setGalleryImage(index);
    dialog.showModal();
    closeButton?.focus();
  }

  function closeGallery() {
    if (!dialog || !dialog.open) {
      return;
    }

    dialog.close();
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }

  if (galleryItems.length && dialog) {
    galleryItems.forEach(function (item, index) {
      item.addEventListener("click", function () {
        openGallery(index);
      });
    });

    closeButton?.addEventListener("click", closeGallery);

    prevButton?.addEventListener("click", function () {
      const nextIndex = (activeGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
      setGalleryImage(nextIndex);
    });

    nextButton?.addEventListener("click", function () {
      const nextIndex = (activeGalleryIndex + 1) % galleryItems.length;
      setGalleryImage(nextIndex);
    });

    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) {
        closeGallery();
      }
    });

    dialog.addEventListener("cancel", function (event) {
      event.preventDefault();
      closeGallery();
    });
  }
})();
