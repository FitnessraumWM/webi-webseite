# WEBI V2 Technical Plan

Stand: 2026-06-24
Branch: `redesign-webi-v2`

## Leitplanken

- Keine produktive Veröffentlichung und kein Push ohne Freigabe.
- GitHub Pages und `CNAME` mit `webi.family` bleiben erhalten.
- Bestehende Funktionen für Fitnessraum-Reservation, Login, Push und interne Bereiche dürfen nicht beschädigt werden.
- Deutsche Texte mit ä, ö, ü und immer `ss` statt Eszett.
- Menü schlank, zentriert und textbasiert.
- Menü darf beim Scrollen nach unten dezent verschwinden und beim Scrollen nach oben wieder erscheinen.
- Light Mode und Dark Mode bleiben erhalten.
- Logos dürfen nicht verzerrt werden und müssen in beiden Modi funktionieren.
- Nicht-Fotosektionen erhalten keine unnötigen Bild- oder Content-Modals.

## Phase-2-Empfehlung

Zuerst einen klickbaren Startseiten-Prototyp erstellen. Erst danach die restlichen Seiten umbauen.

Empfohlener Ablauf:

1. Preview-Datei oder Preview-Pfad anlegen, z. B. `v2.html` oder `preview/index.html`.
2. Startseiten-Prototyp mit neuer Informationsarchitektur bauen.
3. Navigation, Hero, Light/Dark Mode und responsive Verhalten auf allen Ziel-Viewports testen.
4. Bestehende Links zu kritischen Funktionen unverändert verlinken, besonders `/fitness/`.
5. Nach Freigabe Inhalte aus der langen Einzelseite schrittweise in neue Bereiche überführen.
6. Erst ganz am Ende `index.html` ersetzen.

## Technische Zielstruktur

Kurzfristig möglich ohne Build-System:

```text
.
- index.html
- preview/
  - index.html              # optionaler Prototyp für Phase 2
- assets/
  - css/
    - webi.css
  - js/
    - webi.js
  - img/
  - video/
  - docs/
- fitness/
  - index.html              # unverändert isolieren
- OneSignalSDKWorker.js       # im Root belassen
- CNAME
```

Wichtig: Diese Struktur ist ein Vorschlag für Phase 2/3. In Phase 1 wurde sie nicht umgesetzt.

## Bereiche und technische Empfehlung

| Bereich | Aktueller Zweck | Betroffene Dateien | Risiken | Empfehlung |
|---|---|---|---|---|
| Root `index.html` | Monolithische Startseite | `index.html` | Hohe Kopplung von CSS, JS, Content, Modals, Navigation | In Prototyp aufteilen, danach kontrolliert ersetzen |
| Navigation | Anker-Navigation über lange Seite | `index.html` | Zu viele Punkte, Wrap auf Mobile, Icons im Menü | Neue Top-Navigation mit 6 Textpunkten |
| Hero | Video/Fallback, Logos, Headline | `index.html`, `webermuehle.*`, Logos | Absolute Positionen, `overflow: hidden`, sehr grosse Video-Dateien | Responsiven Hero ohne harte Viewport-Abhängigkeit bauen |
| Theme | Dark/Light per Body-Klasse und localStorage | `index.html`, `fitness/index.html` | Unterschiedliche Theme-Implementierungen | Startseite separat modernisieren, Fitness-App nicht anfassen |
| Galerie-Modal | Bildvorschau für alle Galerien | `index.html` | Bei Redesign nicht für Textbereiche verwenden | Nur für Fotogalerien übernehmen |
| Google Translate | Externes Widget | `index.html` | Layout-Eingriff, externe Verfügbarkeit | Bewusst entscheiden; falls behalten, sauber kapseln |
| Formulare | Google Forms in Iframes | `anmeldungSOFE.html`, `fitness-anmeldung.html` | Feste Höhen, externe Abhängigkeit | Links stabil lassen, später responsive Wrapper |
| Fitness-App | Auth, Reservation, Push | `fitness/index.html`, `OneSignalSDKWorker.js` | Hochkritisch; Backend/API/Service Worker | In Phase 2 nur verlinken, keine funktionale Änderung |
| Legacy Fitness-Kalender | Google Calendar Embed | `fitnessraum-kalender.html` | Verwechslung mit neuer App | Status klären, ggf. archivieren |
| Interner Bereich | Linkliste | `index.html` | Kein echter Login; unklare Linktexte | Als Linkhub neu beschriften |
| Separate Seiten | News, Rooftop | `news.html`, `rooftop.html` | Tote Links/falsche Assetpfade | Archivieren oder in neue IA aufnehmen |

## Kritische Integrationen schützen

### Fitness-App

Nicht ohne separaten Funktionstest ändern:

- `fitness/index.html`
- `OneSignalSDKWorker.js`
- Firebase SDK Imports
- Firebase Auth-Konfiguration
- Apps-Script Backend-Konstante
- OneSignal App-ID
- API-Aktionen: `ping`, `availability_month`, `availability_week`, `availability_day`, `my_reservations`, `reserve_slot`, `cancel_reservation`

Empfehlung: Die Fitness-App bleibt in Phase 2 als eigenständige App unter `/fitness/`. Die neue Website verlinkt sie nur mit klarer Beschriftung.

### Service Worker

`OneSignalSDKWorker.js` liegt im Root und importiert das OneSignal SDK. Datei und Pfad nicht verschieben, solange Push funktionieren soll.

### Domain

`CNAME` mit `webi.family` nicht ändern.

## Responsive-Anforderungen für Phase 2

Verbindliche Ziel-Viewports:

- 1024 x 768
- 1280 x 800
- 1366 x 768
- 1440 x 900
- 1920 x 1080
- 768 x 1024
- 390 x 844
- Browser-Zoom 125 Prozent
- Browser-Zoom 150 Prozent
- Browser-Zoom 200 Prozent

Umsetzungsregeln:

- Keine wichtigen Inhalte ausschliesslich innerhalb von `100vh` oder sehr hohen `vh`-Containern platzieren.
- Hero so bauen, dass nächster Inhalt bereits sichtbar oder schnell erreichbar ist.
- Absolute Positionierung nur für dekorative Ebenen, nicht für Kerntext oder Kernnavigation.
- Navigationslinks sollen umbrechen dürfen oder in eine einfache mobile Textnavigation wechseln.
- Keine horizontalen Scrollbereiche für Seitenlayout.
- Tabellen in Kontaktkarten umwandeln oder konsequent responsive machen.
- Bilder mit `max-width: 100%`, `height: auto` und sinnvollem `object-fit` behandeln.
- Logos mit festen Seitenverhältnissen oder natürlicher Bildgrösse anzeigen, nie strecken.
- Fitness-App separat testen, falls ihre CSS angefasst wird.

## Konkreter Phase-2-Plan

1. Prototyp-Datei erstellen
   - Neuer Startseiten-Prototyp auf separatem Pfad.
   - Bestehende `index.html` bleibt produktiv unverändert.

2. Inhaltsgerüst bauen
   - Startseite
   - Veranstaltungen
   - Räume
   - Quartier
   - Hilfe & Kontakt
   - Interner Bereich

3. Schlanke Navigation implementieren
   - Zentriert, textbasiert, ohne unnötige Menü-Icons.
   - Scroll-hide erhalten.
   - Mobile Navigation auf Lesbarkeit und Touch-Ziele testen.

4. Designsystem minimal definieren
   - Farben für Light/Dark Mode.
   - Typografie, Abstände, Link- und Button-Stile.
   - Keine einfarbige Monoton-Palette.

5. Hero und Startseitenmodule bauen
   - Webermühle als klares erstes Signal.
   - Video nur falls performant und nicht dominant.
   - Keine abgeschnittenen Inhalte bei 4:3, 16:10 und Zoom.

6. Bestehende Funktionen verlinken
   - `/fitness/` für Reservation.
   - `anmeldungSOFE.html` für Sommerfest.
   - `fitness-anmeldung.html` für Fitness-Anmeldung.
   - Downloads stabil lassen.

7. Viewport-Test
   - Alle Ziel-Viewports prüfen.
   - Zusätzlich Zoom 125/150/200 Prozent.
   - Besonderes Augenmerk auf Navigation, Hero, Sponsor-Logos, Kontaktkarten und Fitness-Link.

8. Review vor Produktivumbau
   - Prototyp mit Stakeholdern prüfen.
   - Danach Migration in kleinere Schritte planen.

## Validierung in dieser Phase

Durchgeführt:

- Branch geprüft: `redesign-webi-v2`
- Projektstruktur erfasst
- HTML-Dateien, Assets, externe Abhängigkeiten und kritische Funktionsstellen analysiert
- Responsive-Risikomuster statisch bewertet

Nicht durchgeführt:

- Keine produktive Website geändert
- Kein Browser-Screenshot-Test
- Kein Push
- Kein Deployment
- Keine Funktionsänderung an Fitness, Login oder Push

## Offene Risiken

- Externe Formular-, Kalender-, Translate-, Counter-, Firebase-, Apps-Script- und OneSignal-Dienste können Verhalten ausserhalb des Repositories ändern.
- Die genaue Backend-Implementierung des Fitnessraums liegt nicht im Repository und wurde nicht geprüft.
- Mehrere Links führen zu externen privaten/organisatorischen Diensten; Ziel und Berechtigung sollten vor Launch bestätigt werden.
- `news.html` und `rooftop.html` enthalten tote oder falsche interne Links/Pfade.
- Die aktuelle Startseite ist monolithisch; ein direkter Umbau von `index.html` hätte ein hohes Regressionsrisiko.
