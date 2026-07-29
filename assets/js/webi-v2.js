function compareEventsForHomepage(a, b) {
  const aStart = Date.parse(a.startAt || "");
  const bStart = Date.parse(b.startAt || "");
  if (Number.isFinite(aStart) && Number.isFinite(bStart)) { return aStart - bStart; }
  const aTime = a.time || "23:59";
  const bTime = b.time || "23:59";
  return `${a.date}T${aTime}`.localeCompare(`${b.date}T${bTime}`);
}

function compareEventsChronologically(a, b) {
  const aStart = Date.parse(a.startAt || "");
  const bStart = Date.parse(b.startAt || "");
  if (Number.isFinite(aStart) && Number.isFinite(bStart)) { return aStart - bStart; }
  const aTime = a.time || "00:00";
  const bTime = b.time || "00:00";
  return `${a.date}T${aTime}`.localeCompare(`${b.date}T${bTime}`);
}

// Homepage teaser: prefer today's published event(s); otherwise fall back to the
// nearest future one so a real event is never hidden behind the "no event today" copy.
// Past events never qualify as "today" or "next" here (date comparisons are >= today only).
function selectHomeEventPresentation(events, todayIso) {
  const publishedEvents = (events || []).filter(function (event) {
    return event.status === "published";
  });
  const todayEvents = publishedEvents.filter(function (event) {
    return event.date === todayIso;
  });
  const nextEvent = publishedEvents
    .filter(function (event) {
      return event.date >= todayIso;
    })
    .slice()
    .sort(compareEventsForHomepage)[0] || null;

  if (todayEvents.length) {
    return { heading: "Heute in der Webermühle", todayEvents: todayEvents, nextEvent: nextEvent };
  }
  if (nextEvent) {
    return { heading: "Nächste Veranstaltung", todayEvents: [nextEvent], nextEvent: nextEvent };
  }
  return { heading: "Heute in der Webermühle", todayEvents: [], nextEvent: null };
}

function selectCurrentOrUpcomingEvents(events, todayIso) {
  return (events || []).filter(function (event) {
    return event.date >= todayIso;
  });
}

function selectArchivedEvents(events, todayIso) {
  return (events || [])
    .filter(function (event) {
      return event.status === "published" && event.date < todayIso;
    })
    .slice()
    .sort(function (a, b) {
      return compareEventsChronologically(b, a);
    });
}

function initWebiV2() {
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

  const heroSlogan = document.querySelector("[data-hero-slogan]");
  const heroSloganMain = document.querySelector("[data-hero-slogan-main]");
  const heroSloganSub = document.querySelector("[data-hero-slogan-sub]");

  if (heroSlogan && heroSloganMain && heroSloganSub) {
    const heroSloganOptions = [
      { weight: 175, main: "Wo Nachbarschaft zu Gemeinschaft wird." },
      { weight: 175, main: "Dein Quartier. Deine Räume. Deine Gemeinschaft." },
      { weight: 175, main: "Ein Quartier, in dem Menschen, Ideen und gute Momente zusammenkommen." },
      {
        weight: 175,
        main: "Offen für Menschen. Klar in unseren Werten.",
        sub: "Respekt, Sicherheit und ein fairer Dialog gehören für uns zusammen."
      },
      { weight: 30, main: "Gemeinsam wohnen. Gemeinsam erleben. Gemeinsam zuhause sein." },
      { weight: 30, main: "Ein Quartier voller Leben, Ideen und Begegnungen." },
      { weight: 30, main: "Räume für Menschen. Platz für Gemeinschaft." },
      { weight: 30, main: "Hier treffen Menschen, Ideen und gute Momente zusammen." },
      { weight: 30, main: "Mehr als ein Zuhause – ein Quartier, das verbindet." },
      { weight: 30, main: "Vielfalt verbindet – Respekt macht Gemeinschaft möglich." },
      { weight: 30, main: "Offen für Vielfalt. Klar gegen Gewalt und Ausgrenzung." },
      { weight: 30, main: "Gemeinschaft heisst: einander respektieren, Verantwortung übernehmen und miteinander reden." },
      { weight: 30, main: "Ein Zuhause für viele Menschen – getragen von Respekt, Sicherheit und Zusammenhalt." },
      { weight: 30, main: "Offen im Herzen. Klar in der Haltung. Gemeinsam im Quartier." }
    ];
    const totalWeight = heroSloganOptions.reduce(function (sum, option) {
      return sum + option.weight;
    }, 0);
    let pick = Math.random() * totalWeight;
    const selectedSlogan = heroSloganOptions.find(function (option) {
      pick -= option.weight;
      return pick < 0;
    }) || heroSloganOptions[0];

    heroSloganMain.textContent = selectedSlogan.main;
    heroSloganSub.textContent = selectedSlogan.sub || "";
    heroSloganSub.hidden = !selectedSlogan.sub;
    heroSlogan.classList.add("is-ready");
  }

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

  const eventsFeed = document.querySelector("[data-events-feed]");
  const homeEvents = document.querySelector("[data-home-events]")
    || document.getElementById("heute-title")?.closest("section");
  const eventsSource = eventsFeed || homeEvents;

  if (eventsSource) {
    const eventsList = eventsFeed?.querySelector("[data-events-list]");
    const eventsMessage = eventsFeed?.querySelector("[data-events-message]");
    const eventsUpdated = eventsFeed?.querySelector("[data-events-updated]");
    const eventsArchive = document.querySelector("[data-events-archive]");
    const eventsArchiveList = eventsArchive?.querySelector("[data-events-archive-list]");
    const eventsArchiveMessage = eventsArchive?.querySelector("[data-events-archive-message]");
    const todayEventsList = ensureTodayEventsList();
    const heuteTitle = homeEvents?.querySelector("#heute-title");
    const nextEventTitle = document.querySelector("[data-next-event-title]")
      || document.getElementById("event-title");
    const nextEventIntro = document.querySelector("[data-next-event-intro]")
      || nextEventTitle?.nextElementSibling;
    const nextEventCard = document.querySelector("[data-next-event-card]")
      || document.querySelector("#event .event-card");
    const localEventsUrl = eventsSource.dataset.eventsData || "data/veranstaltungen.json";
    const liveEventsUrl = "https://events.webi.family/veranstaltungen.json";
    const eventProductionHosts = new Set(["webi.family", "www.webi.family"]);
    const isEventProductionHost = eventProductionHosts.has(window.location.hostname);
    const eventsUrl = isEventProductionHost ? liveEventsUrl : localEventsUrl;
    const validOrganisers = new Set([
      "Quartierverein Webermühle-Klosterrüti",
      "Verein SOFE Webi",
      "Quartierverein Webermühle-Klosterrüti & Verein SOFE Webi",
      "Persienmarkt"
    ]);
    const validOrganiserKeys = new Set(["quartierverein", "sofe", "quartierverein_sofe", "persienmarkt", "other"]);
    const validExternalLabels = new Set(["Website", "Facebook", "Instagram", "Weitere Informationen"]);
    let hasEventData = false;
    let eventDataUnavailable = false;
    let currentEvents = [];
    let eventsUpdatedAt = null;

    function validIsoDate(value) {
      if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
      }

      const date = new Date(`${value}T00:00:00`);
      return !Number.isNaN(date.getTime()) && value === [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0")
      ].join("-");
    }

    function validEventTime(value) {
      return typeof value === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
    }

    function optionalText(value) {
      return typeof value === "string" ? value.trim() : "";
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

    function formatEventDate(value) {
      const date = new Date(`${value}T00:00:00`);
      return new Intl.DateTimeFormat("de-CH", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(date);
    }

    function todayIsoDate() {
      const today = new Date();
      return [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
      ].join("-");
    }

    function eventAnchorId(event) {
      if (!event.id) {
        return "";
      }

      return `event-${event.id.replace(/[^A-Za-z0-9_-]/g, "-")}`;
    }

    function eventDetailsHref(event) {
      const anchorId = eventAnchorId(event);
      return anchorId ? `veranstaltungen.html#${anchorId}` : "veranstaltungen.html";
    }

    function validateEventMedia(media) {
      if (!media || typeof media !== "object") {
        return null;
      }

      if (!Number.isInteger(media.publishedPhotoCount) || media.publishedPhotoCount < 0) {
        return null;
      }

      const urlText = typeof media.retrospectiveUrl === "string" ? media.retrospectiveUrl.trim() : "";
      const uploadText = typeof media.photo_upload_url === "string" ? media.photo_upload_url.trim() : "";
      function safeMediaUrl(value, route) {
        if (!value) { return ""; }
        try {
          const url = new URL(value);
          return url.origin === "https://fotos.webi.family"
            && new RegExp(`^/${route}/[A-Za-z0-9_-]+$`).test(url.pathname)
            && !url.search && !url.hash ? url.href : "";
        } catch { return ""; }
      }

      const startsAt = Date.parse(media.photo_upload_opens_at || "");
      const closesAt = Date.parse(media.photo_upload_closes_at || "");
      const retrospectiveUrl = safeMediaUrl(urlText, "r");
      if (!Number.isFinite(startsAt) || !Number.isFinite(closesAt) || closesAt <= startsAt) {
        return retrospectiveUrl ? { retrospectiveUrl, publishedPhotoCount: media.publishedPhotoCount } : null;
      }

      return {
        retrospectiveUrl,
        photoUploadUrl: safeMediaUrl(uploadText, "e"),
        opensAt: startsAt,
        closesAt: closesAt,
        publishedPhotoCount: media.publishedPhotoCount,
        serverState: optionalText(media.photo_upload_state)
      };
    }

    // Event Media: derive the CTA from absolute timestamps, never from cached state alone.
    function appendEventMediaAction(parent, event) {
      const media = event.media;
      if (!media) { return; }
      const now = Date.now();
      const actions = document.createElement("div");
      actions.className = "event-media-actions";
      if (media.retrospectiveUrl) {
        appendRetrospectiveLink(actions, event);
      } else if (now < media.opensAt) {
        const button = appendTextElement(actions, "span", "button button-secondary is-disabled", "Fotos hochladen");
        button.setAttribute("aria-disabled", "true");
        appendTextElement(actions, "small", "event-media-hint", `Verfügbar ab ${new Date(media.opensAt).toLocaleString("de-CH", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Zurich" })} Uhr`);
      } else if (now < media.closesAt && media.photoUploadUrl && media.serverState !== "manuell geschlossen" && media.serverState !== "abgesagt") {
        const link = document.createElement("a");
        link.className = "button button-primary";
        link.href = media.photoUploadUrl;
        link.textContent = "Fotos hochladen";
        actions.appendChild(link);
        if (event.endAt && now >= Date.parse(event.endAt)) {
          appendTextElement(actions, "small", "event-media-hint", `Noch möglich bis ${new Date(media.closesAt).toLocaleString("de-CH", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Zurich" })}`);
        }
      } else {
        appendTextElement(actions, "p", "event-media-hint", "Fotos werden geprüft");
      }
      parent.appendChild(actions);
    }

    function appendRetrospectiveLink(parent, event, className) {
      if (!event.media?.retrospectiveUrl) {
        return null;
      }

      const link = document.createElement("a");
      link.className = className || "button button-secondary";
      link.href = event.media.retrospectiveUrl;
      link.textContent = "Rückblick ansehen";
      parent.appendChild(link);
      return link;
    }

    function appendTextElement(parent, tagName, className, text) {
      if (!text) {
        return null;
      }

      const element = document.createElement(tagName);
      if (className) {
        element.className = className;
      }
      element.textContent = text;
      parent.appendChild(element);
      return element;
    }

    function eventMetaText(event) {
      return [
        formatEventDate(event.date),
        event.time ? `${event.time} Uhr` : "",
        event.location
      ].filter(Boolean).join(" · ");
    }

    function eventTimeRangeText(event) {
      const start = Date.parse(event.startAt || "");
      const end = Date.parse(event.endAt || "");
      if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) {
        return event.time ? `${event.time} Uhr` : "";
      }
      const dateFormat = new Intl.DateTimeFormat("de-CH", { dateStyle: "short", timeZone: "Europe/Zurich" });
      const dateKeyFormat = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "Europe/Zurich" });
      function dateKey(value) {
        const parts = Object.fromEntries(dateKeyFormat.formatToParts(value).map(function (part) { return [part.type, part.value]; }));
        return `${parts.year}-${parts.month}-${parts.day}`;
      }
      const timeFormat = new Intl.DateTimeFormat("de-CH", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Zurich" });
      const startDate = dateFormat.format(start);
      const endDate = dateFormat.format(end);
      if (startDate === endDate) { return `${timeFormat.format(start)}–${timeFormat.format(end)} Uhr`; }
      const startKey = dateKey(start);
      const nextDay = new Date(`${startKey}T12:00:00Z`); nextDay.setUTCDate(nextDay.getUTCDate() + 1);
      if (dateKey(nextDay) === dateKey(end)) { return `${timeFormat.format(start)} Uhr bis ${timeFormat.format(end)} Uhr am nächsten Tag`; }
      return `${timeFormat.format(start)} Uhr bis ${dateFormat.format(end)}, ${timeFormat.format(end)} Uhr`;
    }

    function setEventsMessage(text) {
      if (eventsMessage) {
        eventsMessage.textContent = text;
      }
    }

    function setEventsUpdated() {
      if (!eventsUpdated) {
        return;
      }

      const label = eventsUpdatedAt ? updatedAtLabel(eventsUpdatedAt) : "";
      eventsUpdated.hidden = !label;
      eventsUpdated.textContent = label ? `Letzte Aktualisierung: ${label}` : "";
    }

    function clearEventsList() {
      if (eventsList) {
        eventsList.innerHTML = "";
      }
    }

    function ensureTodayEventsList() {
      if (!homeEvents) {
        return null;
      }

      const existingList = homeEvents.querySelector("[data-today-events-list]");
      if (existingList) {
        return existingList;
      }

      const title = homeEvents.querySelector("#heute-title");
      const container = title?.parentElement;
      if (!title || !container) {
        return null;
      }

      Array.from(container.children).forEach(function (child) {
        if (child !== title && !child.classList.contains("eyebrow")) {
          child.remove();
        }
      });

      const list = document.createElement("div");
      list.className = "today-events-list";
      list.dataset.todayEventsList = "";

      const loading = document.createElement("p");
      loading.textContent = "Veranstaltungen werden geladen.";
      list.appendChild(loading);
      title.insertAdjacentElement("afterend", list);
      return list;
    }

    function renderEventCard(event) {
      const article = document.createElement("article");
      article.className = "event-card";
      const anchorId = eventAnchorId(event);
      if (anchorId) {
        article.id = anchorId;
      }
      if (event.status === "cancelled") {
        article.classList.add("is-cancelled");
      }

      if (event.eventScope === "nearby") {
        appendTextElement(article, "p", "event-kicker", "In der Umgebung");
        appendTextElement(article, "p", "event-organiser", `Veranstaltet von: ${event.organiserLabel}`);
      } else {
        appendTextElement(article, "p", "event-kicker", event.organiserLabel);
      }

      if (event.status === "cancelled") {
        const status = document.createElement("span");
        status.className = "event-status-badge";
        status.textContent = "Abgesagt";
        article.appendChild(status);
      } else if (event.timeState === "beendet") {
        const status = document.createElement("span");
        status.className = "event-status-badge";
        status.textContent = "Beendet";
        article.appendChild(status);
      }

      const title = document.createElement("h3");
      title.textContent = event.title;
      article.appendChild(title);

      const date = document.createElement("p");
      date.textContent = formatEventDate(event.date);
      article.appendChild(date);

      const timeRange = eventTimeRangeText(event);
      if (timeRange) {
        const time = document.createElement("p");
        time.textContent = timeRange;
        article.appendChild(time);
      }

      if (event.location) {
        const location = document.createElement("p");
        location.textContent = event.location;
        article.appendChild(location);
      }

      if (event.description) {
        const description = document.createElement("p");
        description.textContent = event.description;
        article.appendChild(description);
      }

      if (event.externalLinks.length) {
        const links = document.createElement("div");
        links.className = "event-external-links";
        event.externalLinks.forEach(function (externalLink) {
          const link = document.createElement("a");
          link.href = externalLink.url;
          link.textContent = externalLink.label;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          links.appendChild(link);
        });
        article.appendChild(links);
      }

      appendEventMediaAction(article, event);

      return article;
    }

    function renderArchiveEventCard(event) {
      const article = renderEventCard(event);
      if (!event.media?.retrospectiveUrl) {
        appendTextElement(article, "p", "hint", "Rückblick folgt.");
      }
      return article;
    }

    function renderTodayEvents(todayEvents) {
      if (!todayEventsList) {
        return;
      }

      todayEventsList.innerHTML = "";

      if (eventDataUnavailable && !hasEventData) {
        appendTextElement(todayEventsList, "p", "hint", "Die aktuellen Veranstaltungen sind momentan nicht abrufbar.");
        return;
      }

      if (!todayEvents.length) {
        appendTextElement(todayEventsList, "p", "hint", "Heute ist keine Veranstaltung geplant.");
        return;
      }

      todayEvents.forEach(function (event) {
        const item = document.createElement("div");
        item.className = "home-event-mini";
        appendTextElement(item, "p", "event-kicker", event.organiser);
        appendTextElement(item, "h3", "", event.title);
        appendTextElement(item, "p", "", eventMetaText(event));
        appendTextElement(item, "p", "", event.description);
        appendRetrospectiveLink(item, event, "text-link");
        todayEventsList.appendChild(item);
      });
    }

    function renderNextEventPlaceholder(message) {
      if (nextEventTitle) {
        nextEventTitle.textContent = "Der nächste Anlass wird hier veröffentlicht.";
      }
      if (nextEventIntro) {
        nextEventIntro.textContent = "Sobald ein Anlass bestätigt ist, erscheinen hier Datum, Ort und alle wichtigen Informationen.";
      }
      if (!nextEventCard) {
        return;
      }

      nextEventCard.replaceChildren();
      appendTextElement(nextEventCard, "p", "event-kicker", "Vorschau");
      appendTextElement(nextEventCard, "h3", "", "Zurzeit ist kein nächster Anlass veröffentlicht.");
      appendTextElement(nextEventCard, "p", "", message || "Sobald ein neuer Anlass feststeht, erscheint er hier.");
      const link = document.createElement("a");
      link.className = "button button-primary";
      link.href = "veranstaltungen.html";
      link.textContent = "Zu den Veranstaltungen";
      nextEventCard.appendChild(link);
    }

    function renderNextEvent(event) {
      if (nextEventTitle) {
        nextEventTitle.textContent = "Der nächste Anlass";
      }
      if (nextEventIntro) {
        nextEventIntro.textContent = "Der nächste veröffentlichte Anlass in der Webermühle.";
      }
      if (!nextEventCard) {
        return;
      }

      nextEventCard.replaceChildren();
      appendTextElement(nextEventCard, "p", "event-kicker", event.organiser);
      appendTextElement(nextEventCard, "h3", "", event.title);
      appendTextElement(nextEventCard, "p", "", formatEventDate(event.date));
      appendTextElement(nextEventCard, "p", "", event.time ? `${event.time} Uhr` : "");
      appendTextElement(nextEventCard, "p", "", event.location);
      appendTextElement(nextEventCard, "p", "", event.description);

      const link = document.createElement("a");
      link.className = "button button-primary";
      link.href = eventDetailsHref(event);
      link.textContent = "Zur Veranstaltung";
      nextEventCard.appendChild(link);
      appendRetrospectiveLink(nextEventCard, event);
    }

    function renderHomeEvents() {
      if (!homeEvents) {
        return;
      }

      if (eventDataUnavailable && !hasEventData) {
        if (heuteTitle) {
          heuteTitle.textContent = "Heute in der Webermühle";
        }
        renderTodayEvents([]);
        renderNextEventPlaceholder("Die aktuellen Veranstaltungen sind momentan nicht abrufbar.");
        return;
      }

      const today = todayIsoDate();
      const presentation = selectHomeEventPresentation(currentEvents, today);

      if (heuteTitle) {
        heuteTitle.textContent = presentation.heading;
      }
      renderTodayEvents(presentation.todayEvents);
      if (presentation.nextEvent) {
        renderNextEvent(presentation.nextEvent);
      } else {
        renderNextEventPlaceholder("Sobald ein neuer Anlass feststeht, erscheint er hier.");
      }
    }

    function renderEvents() {
      if (!eventsFeed || !eventsList) {
        return;
      }

      clearEventsList();
      if (eventsArchiveList) {
        eventsArchiveList.innerHTML = "";
      }

      if (eventDataUnavailable && !hasEventData) {
        setEventsMessage("Die aktuellen Veranstaltungen sind momentan nicht abrufbar. Bitte versuche es später erneut oder melde dich direkt beim Quartierverein.");
        if (eventsArchiveMessage) {
          eventsArchiveMessage.textContent = "Das Veranstaltungsarchiv ist momentan nicht abrufbar.";
        }
        if (eventsUpdated) {
          eventsUpdated.hidden = true;
          eventsUpdated.textContent = "";
        }
        return;
      }

      const today = todayIsoDate();
      const currentOrUpcomingEvents = selectCurrentOrUpcomingEvents(currentEvents, today);
      const archivedEvents = selectArchivedEvents(currentEvents, today);

      if (!currentOrUpcomingEvents.length) {
        setEventsMessage("Zurzeit sind keine neuen Veranstaltungen angekündigt. Schau bald wieder vorbei.");
      } else {
        setEventsMessage("");
        [
          ["own", "Unsere Veranstaltungen"],
          ["nearby", "In der Umgebung"]
        ].forEach(function (sectionDefinition) {
          const sectionEvents = currentOrUpcomingEvents.filter(function (event) {
            return event.eventScope === sectionDefinition[0];
          });
          if (!sectionEvents.length) { return; }
          const section = document.createElement("section");
          section.className = "events-scope-section";
          appendTextElement(section, "h2", "events-scope-title", sectionDefinition[1]);
          const list = document.createElement("div");
          list.className = "events-scope-list";
          sectionEvents.forEach(function (event) { list.appendChild(renderEventCard(event)); });
          section.appendChild(list);
          eventsList.appendChild(section);
        });
      }

      if (eventsArchiveMessage) {
        eventsArchiveMessage.textContent = archivedEvents.length
          ? ""
          : "Zurzeit sind keine vergangenen Veranstaltungen im Archiv.";
      }
      archivedEvents.forEach(function (event) {
        eventsArchiveList?.appendChild(renderArchiveEventCard(event));
      });
      setEventsUpdated();
    }

    function validateEventsData(data) {
      if (!data || data.schemaVersion !== 1 || !Array.isArray(data.events)) {
        throw new Error("event data unavailable");
      }

      const seenIds = new Set();
      const validEvents = [];

      data.events.forEach(function (rawEvent) {
        if (!rawEvent || typeof rawEvent !== "object") {
          return;
        }

        const id = typeof rawEvent.id === "string" ? rawEvent.id.trim() : "";
        if (id && seenIds.has(id)) {
          return;
        }

        const title = optionalText(rawEvent.title);
        const organiser = optionalText(rawEvent.organiser_label || rawEvent.organiser);
        const organiserKey = optionalText(rawEvent.organiser_key) || "quartierverein";
        const eventScope = rawEvent.event_scope === "nearby" ? "nearby" : "own";
        const date = rawEvent.date;
        const time = rawEvent.time === null || rawEvent.time === undefined ? "" : optionalText(rawEvent.time);
        const location = rawEvent.location === null || rawEvent.location === undefined ? "" : optionalText(rawEvent.location);
        const description = rawEvent.description === null || rawEvent.description === undefined ? "" : optionalText(rawEvent.description);
        const status = rawEvent.status === undefined || rawEvent.status === null ? "published" : optionalText(rawEvent.status);

        if (!title || !organiser || !validOrganiserKeys.has(organiserKey) || !validIsoDate(date)) {
          return;
        }
        if ((eventScope === "nearby") !== (organiserKey === "other")) {
          return;
        }
        if (eventScope === "own" && !validOrganisers.has(organiser)) {
          return;
        }

        if (time && !validEventTime(time)) {
          return;
        }

        if (status !== "published" && status !== "cancelled") {
          return;
        }

        if (id) {
          seenIds.add(id);
        }

        const externalLinks = Array.isArray(rawEvent.external_links) ? rawEvent.external_links.reduce(function (safeLinks, link) {
          if (!link || !validExternalLabels.has(link.label)) { return safeLinks; }
          try {
            const url = new URL(link.url);
            if (url.protocol === "https:" && url.hostname && !url.username && !url.password) {
              safeLinks.push({ label: link.label, url: url.href });
            }
          } catch { /* Ungültige externe Links werden nicht dargestellt. */ }
          return safeLinks;
        }, []) : [];

        validEvents.push({
          id,
          title,
          organiser: organiser,
          organiserLabel: organiser,
          organiserKey,
          eventScope,
          externalLinks,
          date,
          time,
          location,
          description,
          status,
          startAt: typeof rawEvent.start_at === "string" ? rawEvent.start_at : "",
          endAt: typeof rawEvent.end_at === "string" ? rawEvent.end_at : "",
          timeState: ["geplant", "läuft gerade", "beendet"].includes(rawEvent.time_state) ? rawEvent.time_state : "",
          media: validateEventMedia(rawEvent.media)
        });
      });

      validEvents.sort(compareEventsChronologically);

      return {
        events: validEvents,
        updatedAt: typeof data.updatedAt === "string" && updatedAtLabel(data.updatedAt)
          ? data.updatedAt
          : null
      };
    }

    function fetchEventsData(url) {
      const controller = new AbortController();
      const timeout = window.setTimeout(function () {
        controller.abort();
      }, 8000);
      const requestUrl = isEventProductionHost
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

    if (eventsFeed) {
      renderEvents();
    }

    if (eventsUrl) {
      function refreshEventFeed(initialLoad) {
        return fetchEventsData(eventsUrl)
        .then(function (response) {
          if (!response.ok) {
            throw new Error("event data unavailable");
          }
          return response.json();
        })
        .then(function (data) {
          const validatedData = validateEventsData(data);
          currentEvents = validatedData.events;
          eventsUpdatedAt = validatedData.updatedAt;
          hasEventData = true;
          eventDataUnavailable = false;
          if (eventsFeed) {
            renderEvents();
          }
          renderHomeEvents();
        })
        .catch(function () {
          eventDataUnavailable = true;
          if (hasEventData || !initialLoad) {
            setEventsMessage("");
            setEventsUpdated();
            renderHomeEvents();
          } else {
            currentEvents = [];
            eventsUpdatedAt = null;
            if (eventsFeed) {
              renderEvents();
            }
            renderHomeEvents();
          }
        });
      }
      refreshEventFeed(true);
      window.setInterval(function () { refreshEventFeed(false); }, 60000);
    }
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

  // ---------------------------------------------------------------------------
  // Newsletter-Anmeldeformular
  // ---------------------------------------------------------------------------
  (function initNewsletterForm() {
    var form = document.querySelector("[data-newsletter-form]");
    if (!form) { return; }

    var resultEl = form.querySelector(".newsletter-result");
    var submitBtn = form.querySelector(".newsletter-submit");

    var newsletterProductionHosts = new Set(["webi.family", "www.webi.family"]);
    var isNewsletterProd = newsletterProductionHosts.has(window.location.hostname);
    var apiUrl = isNewsletterProd
      ? "https://newsletter.webi.family/api/subscribe"
      : "http://127.0.0.1:8095/api/subscribe";

    function showResult(message, isError) {
      resultEl.textContent = message;
      resultEl.removeAttribute("hidden");
      if (isError) {
        resultEl.setAttribute("data-status", "error");
      } else {
        resultEl.removeAttribute("data-status");
      }
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var emailInput = form.querySelector("[name='email']");
      var consentInput = form.querySelector("[name='consent']");
      var honeypotInput = form.querySelector("[name='company']");

      if (!emailInput || !consentInput) { return; }

      if (!consentInput.checked) {
        showResult("Bitte stimme der Verarbeitung deiner E-Mail-Adresse zu.", true);
        consentInput.focus();
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Wird gesendet …";
      if (resultEl) { resultEl.setAttribute("hidden", ""); }

      var payload = {
        email: emailInput.value,
        consent: consentInput.checked,
        company: honeypotInput ? honeypotInput.value : ""
      };

      fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
        .then(function (response) { return response.json(); })
        .then(function (data) {
          if (data.ok) {
            showResult(data.message || "Bitte prüfe deine E-Mail und bestätige deine Anmeldung.", false);
            form.reset();
          } else {
            showResult(data.message || "Ein Fehler ist aufgetreten. Bitte versuche es erneut.", true);
          }
        })
        .catch(function () {
          showResult("Der Server ist gerade nicht erreichbar. Bitte versuche es später erneut.", true);
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = "Anmelden";
        });
    });
  })();
}

if (typeof document !== "undefined") {
  initWebiV2();
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    selectHomeEventPresentation: selectHomeEventPresentation,
    selectCurrentOrUpcomingEvents: selectCurrentOrUpcomingEvents,
    selectArchivedEvents: selectArchivedEvents,
    compareEventsForHomepage: compareEventsForHomepage,
    compareEventsChronologically: compareEventsChronologically
  };
}
