(function () {
  const root = document.documentElement;
  const header = document.querySelector("[data-header]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-nav]");
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const themeLabel = document.querySelector("[data-theme-label]");
  const storageKey = "webi-v2-theme";

  function redirectLegacyIndexHash() {
    const legacyTargets = {
      "#partyraum": "partyraum.html",
      "#rooftop": "raeume.html#rooftop",
      "#fitness": "raeume.html#fitnessraum",
      "#spielgruppe": "quartier.html#spielgruppe",
      "#historie": "geschichte.html",
      "#downloads": "downloads.html",
      "#kontakt": "hilfe-kontakt.html",
      "#sponsoren": "sponsoren.html"
    };
    const target = legacyTargets[window.location.hash];
    const currentFile = window.location.pathname.split("/").pop() || "index.html";

    if (target && currentFile === "index.html") {
      window.location.replace(target);
    }
  }

  redirectLegacyIndexHash();

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
  let activeGalleryItems = galleryItems;
  let lastFocusedElement = null;

  function setGalleryImage(index) {
    const item = activeGalleryItems[index];
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

    const item = galleryItems[index];
    const group = item?.dataset.galleryGroup || "";
    activeGalleryItems = galleryItems.filter(function (galleryItem) {
      return (galleryItem.dataset.galleryGroup || "") === group;
    });
    const groupedIndex = activeGalleryItems.indexOf(item);
    lastFocusedElement = document.activeElement;
    setGalleryImage(groupedIndex >= 0 ? groupedIndex : 0);
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
      const nextIndex = (activeGalleryIndex - 1 + activeGalleryItems.length) % activeGalleryItems.length;
      setGalleryImage(nextIndex);
    });

    nextButton?.addEventListener("click", function () {
      const nextIndex = (activeGalleryIndex + 1) % activeGalleryItems.length;
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

  const partyroomCalendar = document.querySelector("[data-partyroom-calendar]");

  if (partyroomCalendar) {
    const calendarGrid = partyroomCalendar.querySelector("[data-calendar-grid]");
    const calendarTitle = partyroomCalendar.querySelector("[data-calendar-title]");
    const calendarMessage = partyroomCalendar.querySelector("[data-calendar-message]");
    const prevMonthButton = partyroomCalendar.querySelector("[data-calendar-prev]");
    const nextMonthButton = partyroomCalendar.querySelector("[data-calendar-next]");
    const localDataUrl = partyroomCalendar.dataset.partyroomData;
    const liveDataUrl = "https://belegung.webi.family/partyraum-belegung.json";
    const productionHosts = new Set(["webi.family", "www.webi.family"]);
    const isProductionHost = productionHosts.has(window.location.hostname);
    const dataUrl = isProductionHost ? liveDataUrl : localDataUrl;
    const weekdays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
    const statusLabels = {
      frei: "Frei",
      belegt: "Belegt"
    };
    const statusClasses = {
      frei: "frei",
      belegt: "belegt"
    };
    let visibleMonth = new Date();
    visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
    let bookedDays = new Set();
    let updatedAt = null;
    let hasCalendarData = false;
    let dataUnavailable = false;

    function toIsoDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    function monthTitle(date) {
      return new Intl.DateTimeFormat("de-CH", {
        month: "long",
        year: "numeric"
      }).format(date);
    }

    function dayLabel(date) {
      return new Intl.DateTimeFormat("de-CH", {
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(date);
    }

    function updatedAtLabel(value) {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) {
        return "";
      }

      const now = new Date();
      const isToday = date.getFullYear() === now.getFullYear()
        && date.getMonth() === now.getMonth()
        && date.getDate() === now.getDate();
      const time = new Intl.DateTimeFormat("de-CH", {
        hour: "2-digit",
        minute: "2-digit"
      }).format(date);

      if (isToday) {
        return `heute, ${time} Uhr`;
      }

      return new Intl.DateTimeFormat("de-CH", {
        dateStyle: "medium",
        timeStyle: "short"
      }).format(date);
    }

    function publicStatus(isoDate) {
      return bookedDays.has(isoDate) ? "belegt" : "frei";
    }

    function setCalendarMessage() {
      if (!calendarMessage) {
        return;
      }

      if (dataUnavailable && !hasCalendarData) {
        calendarMessage.textContent = "Die aktuelle Belegung ist momentan nicht abrufbar. Für eine verbindliche Anfrage wende dich bitte direkt an Michal Jančovič.";
        return;
      }

      const label = updatedAt ? updatedAtLabel(updatedAt) : "";
      calendarMessage.textContent = label
        ? `Letzte Aktualisierung: ${label}`
        : "Die Belegungsübersicht wird laufend aktualisiert. Für eine verbindliche Anfrage wende dich bitte direkt an Michal Jančovič.";
    }

    function renderCalendarUnavailable() {
      if (!calendarGrid || !calendarTitle) {
        return;
      }

      calendarTitle.textContent = monthTitle(visibleMonth);
      calendarGrid.innerHTML = "";
      setCalendarMessage();
    }

    function renderCalendar() {
      if (!calendarGrid || !calendarTitle) {
        return;
      }

      if (!hasCalendarData) {
        renderCalendarUnavailable();
        return;
      }

      calendarTitle.textContent = monthTitle(visibleMonth);
      calendarGrid.innerHTML = "";

      weekdays.forEach(function (weekday) {
        const weekdayElement = document.createElement("div");
        weekdayElement.className = "calendar-weekday";
        weekdayElement.textContent = weekday;
        calendarGrid.appendChild(weekdayElement);
      });

      const year = visibleMonth.getFullYear();
      const month = visibleMonth.getMonth();
      const firstDay = new Date(year, month, 1);
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const leadingEmptyDays = (firstDay.getDay() + 6) % 7;

      for (let i = 0; i < leadingEmptyDays; i += 1) {
        const emptyDay = document.createElement("div");
        emptyDay.className = "calendar-day is-outside";
        calendarGrid.appendChild(emptyDay);
      }

      for (let day = 1; day <= daysInMonth; day += 1) {
        const date = new Date(year, month, day);
        const isoDate = toIsoDate(date);
        const status = publicStatus(isoDate);
        const dayElement = document.createElement("div");
        const statusText = statusLabels[status];
        dayElement.className = "calendar-day";
        dayElement.dataset.status = statusClasses[status];
        dayElement.setAttribute("role", "group");
        dayElement.setAttribute("aria-label", `${dayLabel(date)}: ${statusText}`);
        dayElement.innerHTML = `<span class="calendar-day-number">${day}</span><span class="calendar-day-status">${statusText}</span>`;
        calendarGrid.appendChild(dayElement);
      }

      setCalendarMessage();
    }

    function changeMonth(offset) {
      visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + offset, 1);
      renderCalendar();
    }

    prevMonthButton?.addEventListener("click", function () {
      changeMonth(-1);
    });

    nextMonthButton?.addEventListener("click", function () {
      changeMonth(1);
    });

    if (!isProductionHost) {
      renderCalendar();
    } else {
      renderCalendarUnavailable();
    }

    function validateCalendarData(data) {
      if (!data || data.schemaVersion !== 1 || !Array.isArray(data.bookedDays)) {
        throw new Error("calendar data unavailable");
      }

      const validDayPattern = /^\d{4}-\d{2}-\d{2}$/;
      const validDays = data.bookedDays.filter(function (day) {
        return typeof day === "string" && validDayPattern.test(day);
      });
      const nextUpdatedAt = typeof data.updatedAt === "string" && updatedAtLabel(data.updatedAt)
        ? data.updatedAt
        : null;

      return {
        bookedDays: new Set(validDays),
        updatedAt: nextUpdatedAt
      };
    }

    function fetchCalendarData(url) {
      const controller = new AbortController();
      const timeout = window.setTimeout(function () {
        controller.abort();
      }, 8000);
      const requestUrl = isProductionHost
        ? `${url}?t=${Date.now()}`
        : url;

      return fetch(requestUrl, {
        cache: "no-store",
        signal: controller.signal
      })
        .finally(function () {
          window.clearTimeout(timeout);
        });
    }

    if (dataUrl) {
      fetchCalendarData(dataUrl)
        .then(function (response) {
          if (!response.ok) {
            throw new Error("calendar data unavailable");
          }
          return response.json();
        })
        .then(function (data) {
          const validatedData = validateCalendarData(data);
          bookedDays = validatedData.bookedDays;
          updatedAt = validatedData.updatedAt;
          hasCalendarData = true;
          dataUnavailable = false;
          renderCalendar();
        })
        .catch(function () {
          dataUnavailable = true;
          if (hasCalendarData) {
            setCalendarMessage();
          } else {
            renderCalendarUnavailable();
          }
        });
    }
  }
})();
