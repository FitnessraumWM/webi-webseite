# WEBI V2 Audit

Stand: 2026-06-24
Branch: `redesign-webi-v2`
Ziel dieser Phase: Analyse und Vorbereitung für ein Redesign ohne sichtbare Layout- oder Inhaltsänderungen an der produktiven Website.

## Projektüberblick

Die Website ist eine statische GitHub-Pages-Seite im Repository-Root. Es gibt keine Paketkonfiguration, kein Build-System und keine getrennten CSS- oder JavaScript-Dateien. CSS und JavaScript sind fast vollständig inline in den jeweiligen HTML-Dateien enthalten.

Hosting und Domain:

- `CNAME`: bestehende Domain `webi.family`
- GitHub Pages bleibt als Hosting-Ziel geeignet, solange die statische Struktur erhalten bleibt.

Zu Beginn von Phase 1 nicht vorhandene Projektdateien im Repository:

- `AGENTS.md`
- `CLAUDE.md`
- `README.md`
- `package.json`

AGENTS.md wurde im Rahmen dieser Vorbereitung neu erstellt und enthält die verbindliche Schweizer Schreibregel für alle zukünftigen Arbeiten.
Die in `AGENTS.md` festgelegten Projektregeln sind für alle zukünftigen Arbeiten verbindlich.

## Vollständige Projektstruktur

```text
.
- Allianz-Logo_GA.jpg
- anmeldungSOFE.html
- anmeldung_fitnessraum.pdf
- apotheke_neuenhof.svg
- Beitrittsformular_QV_2025.pdf
- CNAME
- easteregg.html
- easteregg1.html
- elinag-logo.png
- favicon.png
- fitness/
  - index.html
- fitness-anmeldung.html
- fitnessraum-kalender.html
- fitnessregeln.html
- fitness01.jpg
- fitness02.jpg
- fitness03.jpg
- fitness04.jpg
- fitness05.jpg
- fitness06.jpg
- fitness07.jpg
- fitness08.jpg
- fitness09.jpg
- fitness10.jpg
- fitness11.jpg
- FUBATU.pdf
- historie01.jpg
- historie02.jpg
- historie03.jpg
- historie04.jpg
- historie05.jpg
- historie06.jpg
- historie07.jpg
- historie08.jpg
- historie09.jpg
- historie10.jpg
- historie11.jpg
- historie12.jpg
- index.html
- JahresprogrammQV_2025.pdf
- Jump.wav
- logo-itoba.jpg
- logo-itoba.svg
- logo-jugendarbeit.png
- logo-qv-schwarz.png
- logo-qv-weiss.png
- Logo-Radis-Garage.avif
- Logo_FC_Neuenhof.jpg
- MSSports.jpg
- news.html
- OneSignalSDKWorker.js
- partyraum01.jpg
- partyraum02.jpg
- partyraum03.jpg
- partyraum04.jpg
- partyraum05.jpg
- Raiffeisen-Logo.png
- raiffeisen-logo.svg
- rooftop.html
- rooftop-01.jpg
- rooftop-02.jpg
- rooftop-03.jpg
- rooftop-04.jpg
- rooftop-05.jpg
- rooftop-06.jpg
- rooftop-07.jpg
- rooftop-08.jpg
- rooftop-09.jpg
- rooftop-10.jpg
- rooftop-11.jpg
- rooftop-12.jpg
- rooftop-13.jpg
- sommerfest01.jpg
- sommerfest02.jpg
- sommerfest03.jpg
- sommerfest04.jpg
- sommerfest05.jpg
- sommerfest06.jpg
- sommerfest07.jpg
- sommerfest08.jpg
- sommerfest09.jpg
- sommerfest10.jpg
- sommerfest11.jpg
- sommerfest12.jpg
- spielgruppe01.jpg
- spielgruppe02.jpg
- spielgruppe03.jpg
- spielgruppe04.jpg
- verein-sofe-logo-s.png
- verein-sofe-logo-w.png
- Vorstand_Aufstellung-2025.pdf
- webermuehle-gesamt.jpg
- webermuehle.mp4
- webermuehle.webm
- zwergmuehle-logo.png
```

## Zuständigkeiten nach Datei

| Bereich | Aktueller Zweck | Betroffene Dateien | Risiken bei Umbau | Empfehlung |
|---|---|---|---|---|
| Startseite | Lange Einzelseite mit Hero, Navigation, Inhaltssektionen, Galerie-Modals, Dark Mode, Google Translate und Footer | `index.html`, zahlreiche Root-Bilder, PDFs | Sehr hohe Kopplung durch Inline-CSS/JS; Umbau kann Navigation, Theme, Galerie, Links und Inhalte gleichzeitig betreffen | Umstrukturieren, aber zuerst Prototyp getrennt entwickeln |
| Navigation | Sticky Textmenü mit Scroll-hide, Theme-Schalter, Sprache, Zurück-nach-oben | `index.html` Zeilen ca. 630-646, JS ca. 1000-1150 | Zu viele Menüpunkte, kleine Viewports mit Wrap, Icon-Elemente widersprechen Ziel für schlankes Textmenü | Umstrukturieren |
| CSS | Komplett inline in jeder HTML-Datei | Alle HTML-Dateien, besonders `index.html`, `fitness/index.html` | Doppelte Muster, schwer testbar, viele Viewport-Sonderfälle | In Phase 2/3 in lokale CSS-Dateien auslagern |
| JavaScript Startseite | Theme, Galerie-Modal, Google Translate Positionierung, Countdown, Scroll-Menü | `index.html` | DOM-Abhängigkeiten auf konkrete IDs; Logos werden per JS umgeschaltet | Übernehmen, aber entkoppeln und vereinfachen |
| Bilder | Content-Galerien, Logos, Hero-Video/Fallback, Sponsoren | Root-Dateien `*.jpg`, `*.png`, `*.svg`, `*.avif`, `*.mp4`, `*.webm` | Sehr grosse Videos, grosse Bildlisten, falsche Pfade in `rooftop.html`, externe GitHub-Raw-Grafik für Zwergmühle | Übernehmen, Assets ordnen und optimieren |
| Formulare | Google-Forms Einbettungen für Sommerfest und Fitness-Anmeldung | `anmeldungSOFE.html`, `fitness-anmeldung.html` | Iframes mit festen Höhen, externe Abhängigkeit, noindex sinnvoll | Übernehmen, responsiver einfassen |
| Fitnessraum alt | Kalender-Iframe und Regeln | `fitnessraum-kalender.html`, `fitnessregeln.html`, `anmeldung_fitnessraum.pdf` | Verwechslungsgefahr mit neuer Fitness-App unter `/fitness/` | Archivieren oder klar als Legacy kennzeichnen |
| Fitnessraum neu | Reservierungs-App mit Firebase Auth, Apps Script Backend, OneSignal Push | `fitness/index.html`, `OneSignalSDKWorker.js` | Kritischste Funktion; externe APIs, Auth, Service Worker, Push, Backend-Aktionen | Übernehmen und funktional isolieren |
| Login Startseite | Liste interner Links, kein echter Login | `index.html` Sektion `#login` | Name "Login" kann falsche Erwartung erzeugen; GitHub-Link wirkt Platzhalter | Umstrukturieren zu "Interner Bereich" |
| Interne Links | GitHub, mycloud, Zoho Mail | `index.html` Sektion `#login` | Externe Ziele, eventuell private/organisatorische Relevanz | Übernehmen, Ziele vor Launch prüfen |
| Push | OneSignal SDK und Service Worker | `fitness/index.html`, `OneSignalSDKWorker.js` | Service Worker muss im Root bleiben; Pfad darf nicht gebrochen werden | Übernehmen, nicht verschieben ohne Test |
| News/Rooftop Einzelseiten | Kleine separate Seiten | `news.html`, `rooftop.html` | `rooftop.html` referenziert nicht vorhandene `img/rooftop/...` Pfade; `news.html` verlinkt nicht vorhandene Blogseiten | Archivieren oder neu integrieren |
| Easter Eggs | Spiele/Spielseiten mit lokalem Speicher | `easteregg.html`, `easteregg1.html`, `Jump.wav` | Kein Kerninhalt; können Navigation und Asset-Ordnung verwirren | Archivieren, Links optional versteckt lassen |

## Externe Abhängigkeiten

| Abhängigkeit | Datei | Zweck | Kritikalität |
|---|---|---|---|
| Google Translate Widget | `index.html` | Sprachumschaltung auf Startseite | Mittel; externe Verfügbarkeit und Layout-Eingriff |
| Google Forms | `anmeldungSOFE.html`, `fitness-anmeldung.html` | Anmeldungen | Mittel; Iframe-Höhen und externe Verfügbarkeit |
| Google Calendar Embed | `fitnessraum-kalender.html` | Legacy-Belegungsübersicht | Niedrig bis mittel; vermutlich Legacy |
| Firebase Auth Compat 9.23 | `fitness/index.html` | Login Fitness-App | Hoch |
| Google Apps Script Backend | `fitness/index.html` | Fitnessraum-Verfügbarkeit, Reservation, Storno | Hoch |
| OneSignal Web SDK | `fitness/index.html`, `OneSignalSDKWorker.js` | Push-Funktionen Fitness-App | Hoch |
| hitwebcounter | `index.html`, `fitnessraum-kalender.html`, `fitnessregeln.html` | Besucherzähler | Niedrig; Datenschutz/Optik prüfen |
| Sponsor-Websites | `index.html` | Externe Sponsor-Links | Niedrig |
| GitHub Raw Bild | `index.html` | Zwergmühle-Logo | Niedrig bis mittel; besser lokales Asset nutzen |
| mycloud, Zoho Mail, GitHub | `index.html` | Interner Bereich | Mittel; Link-Ziele vor Veröffentlichung prüfen |

## Potenziell kritische Stellen

- `fitness/index.html` darf nicht durch globale Navigation, neue Router-Logik oder Service-Worker-Änderungen gestört werden.
- `OneSignalSDKWorker.js` muss im Root bleiben, damit OneSignal den Service Worker wie erwartet findet.
- `CNAME` darf nicht verändert werden.
- Alle bisherigen Deep Links und QR-Code-Ziele sollten stabil bleiben: `anmeldungSOFE.html`, `fitness-anmeldung.html`, `fitnessraum-kalender.html`, `fitnessregeln.html`, `/fitness/`.
- `rooftop.html` nutzt Bildpfade `img/rooftop/01.jpg` bis `10.jpg`, diese Dateien existieren nicht. Die eigentlichen Rooftop-Bilder liegen im Root als `rooftop-01.jpg` bis `rooftop-13.jpg`.
- `news.html` verlinkt `blog/sommerfest-2025.html` und `blog/neue-spielgruppe.html`; ein `blog/` Ordner existiert nicht.
- Mehrere Seiten haben feste Iframe-Höhen oder feste Pixelmasse, die bei Browser-Zoom und kleinen Viewports problematisch werden können.
- Die Startseite nutzt im Hero viele absolute Positionen und `overflow: hidden`; bei 4:3, 16:10, Tablet und hohem Zoom können Inhalte abgeschnitten werden.
- In `index.html` gibt es viele Menüpunkte; bei 390 px Breite wird das Menü zwar umgebrochen, ist aber nicht mehr ruhig oder schlank.
- Teile der Kommentare wirken technisch uneinheitlich; user-facing Text scheint überwiegend UTF-8, sollte aber vor Phase 2 bewusst normalisiert werden.

## Responsive-Audit

### Gefundene Risikomuster

| Muster | Fundstellen | Bewertung |
|---|---|---|
| `min-height: 92vh` im Hero | `index.html` Header | Kann auf 1366 x 768 und 1024 x 768 mit absolut positionierten Logos/Texten eng werden |
| `overflow: hidden` im Header | `index.html` | Risiko für abgeschnittene Logos, Countdown oder Hero-Text |
| Absolute Hero-Elemente | `index.html` Logos, Headline, Subline, Video | Hohe Kollisionsgefahr bei 4:3, Tablet, Zoom 150/200 Prozent |
| Sticky/fixed Navigation | `index.html`, `news.html`, `rooftop.html` | Grundsätzlich ok, aber feste Hide-Distanz und Wrap prüfen |
| Modal mit `100vw`/`100vh` | `index.html` Galerie | Ok für Fotos, aber nicht für Nicht-Fotosektionen ausweiten |
| Galerie Grid `minmax(210px, 1fr)` | `index.html` | Gut für Bilder, aber lange Einzelseite bleibt schwer scannbar |
| Sponsor-Logos mit festen Maximalbreiten | `index.html` | Auf sehr kleinen Viewports und Zoom potenziell horizontal knapp |
| Fitness-App Monatsgrid mit 8 Spalten | `fitness/index.html` | Auf 390 px und 200 Prozent Zoom wahrscheinlich horizontal eng |
| Fitness-App Wochenansicht 7 Spalten | `fitness/index.html` | Auf Tablet/Smartphone schwer lesbar; braucht alternative mobile Ansicht |
| Iframes mit festen Höhen | `anmeldungSOFE.html`, `fitness-anmeldung.html`, `fitnessraum-kalender.html` | Bei Zoom und Mobile sehr lange Seiten, aber weniger Abschneiden als bei festen Viewport-Höhen |
| Legacy-Seiten mit fixed Nav | `news.html`, `rooftop.html` | Kleine Seiten, aber in neuer IA wahrscheinlich ersetzbar |
| Easter Eggs mit `overflow: hidden` | `easteregg.html`, `easteregg1.html` | Für Spielseiten bewusst, nicht Teil des Redesign-Kerns |

### Viewport-Bewertung

Es wurde in Phase 1 statisch und anhand der vorhandenen CSS/HTML-Struktur bewertet. Es wurde kein produktiver visueller Umbau vorgenommen.

| Viewport / Zoom | Erwartetes Risiko | Bewertung |
|---|---|---|
| 1024 x 768 | Hero mit `92vh`, absolute Logos, Navigation mit vielen Punkten | Hoch für Enge im Header, mittel für Hauptcontent |
| 1280 x 800 | 16:10, Hero nimmt fast ganzen ersten Screen ein | Mittel; erste Inhaltssektion kaum sichtbar |
| 1366 x 768 | 16:9 mit geringer Höhe | Hoch; Hero-Text, Logos, Navigation und Video konkurrieren |
| 1440 x 900 | Solider Desktop | Mittel; lange Einzelseite bleibt schwer navigierbar |
| 1920 x 1080 | Breit genug | Niedrig bis mittel; ultrawide braucht bessere maximale Textbreiten und Hero-Komposition |
| 768 x 1024 | Tablet Portrait | Mittel bis hoch; Navigation wrappt, Hero-Elemente können kollidieren |
| 390 x 844 | Smartphone | Hoch; Menü ist zu lang, Hero absolute Positionen und Sponsorbreiten kritisch |
| Browser-Zoom 125 Prozent | Navigation und Tabellen werden enger | Mittel |
| Browser-Zoom 150 Prozent | Header und Navigation stark gefährdet | Hoch |
| Browser-Zoom 200 Prozent | Fitness Monats-/Wochenraster und Startseitenmenü kritisch | Hoch |

## Empfehlung für Phase 2

Zuerst einen klickbaren Startseiten-Prototyp bauen, getrennt von der bestehenden produktiven Startseite oder hinter einem klaren Preview-Pfad. Erst wenn Navigation, Hero, Inhaltsstruktur, Dark/Light Mode und Responsive-Verhalten auf den genannten Viewports stabil sind, die restlichen Seiten und Funktionen schrittweise umziehen.
