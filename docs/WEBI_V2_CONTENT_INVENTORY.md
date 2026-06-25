# WEBI V2 Content Inventory

Stand: 2026-06-24
Branch: `redesign-webi-v2`

## Aktuelle Inhaltsbereiche

| Inhalt | Aktueller Zweck | Aktuelle Dateien / Assets | Risiken bei Umbau | Empfehlung |
|---|---|---|---|---|
| Historie | Geschichte der Webermühle mit Bildergalerie | `index.html` Sektion `#historie`, `historie01.jpg` bis `historie12.jpg` | Lange Textstrecke auf Startseite; Galerie-Modal kann Seite unruhig machen | Übernehmen, unter "Quartier" platzieren |
| Vereine | Kurzinfo zu Quartierverein und Verein SOFE Webi | `index.html` Sektion `#vereine`, Logos `logo-qv-*`, `verein-sofe-logo-*` | Doppelt mit Kontaktsektion; Logo-Darstellung im Dark Mode beachten | Umstrukturieren, teils "Quartier", teils "Hilfe & Kontakt" |
| Sommerfest | Eventbeschreibung, Anmeldung, Galerie | `index.html` `#sommerfest`, `anmeldungSOFE.html`, `sommerfest01.jpg` bis `sommerfest12.jpg`, `verein-sofe-logo-*` | Google-Form-Abhängigkeit, viele Bilder, saisonaler Inhalt | Übernehmen unter "Veranstaltungen" |
| Laden | Info zum Persienmarkt / Dorfladen | `index.html` `#laden` | Externer Link und Kontaktdaten müssen aktuell bleiben | Übernehmen unter "Quartier" oder "Hilfe & Kontakt" |
| Partyraum | Rauminfo, Buchungskontakt, Galerie | `index.html` `#partyraum`, `partyraum01.jpg` bis `partyraum05.jpg` | Raum-Buchung darf nicht zwischen anderen Kontaktinfos untergehen | Übernehmen unter "Räume" |
| Rooftop | Rauminfo, Buchungskontakt, Galerie | `index.html` `#rooftop`, `rooftop-01.jpg` bis `rooftop-13.jpg`, `rooftop.html` | Separate `rooftop.html` hat falsche Bildpfade | Übernehmen unter "Räume"; alte Einzelseite archivieren oder reparieren |
| Fitnessraum | Rauminfo, Anmeldung, Regeln, Reservation | `index.html` `#fitness`, `fitness/index.html`, `fitness-anmeldung.html`, `fitnessraum-kalender.html`, `fitnessregeln.html`, `fitness01.jpg` bis `fitness11.jpg`, `anmeldung_fitnessraum.pdf` | Kritische Funktion mit Auth, Backend und Push; Legacy-Kalender kann verwirren | Übernehmen, aber Funktion unverändert lassen und klar unter "Räume" plus "Interner Bereich" verlinken |
| Spielgruppe | Info, Kontakt, Galerie | `index.html` `#spielgruppe`, `spielgruppe01.jpg` bis `spielgruppe04.jpg`, `zwergmuehle-logo.png` | Logo wird aktuell extern von GitHub Raw geladen, obwohl lokal vorhanden | Übernehmen unter "Quartier"; lokales Logo verwenden |
| Downloads | PDF-Sammlung | `index.html` `#downloads`, `Beitrittsformular_QV_2025.pdf`, `anmeldung_fitnessraum.pdf`, `Vorstand_Aufstellung-2025.pdf`, `JahresprogrammQV_2025.pdf`, `FUBATU.pdf` | PDF-Liste kann unklar und saisonal veralten | Übernehmen unter "Hilfe & Kontakt" und thematisch zuordnen |
| Sponsoren | Dank und externe Sponsor-Links | `index.html` `#sponsoren`, Sponsor-Logos | Logos haben viele Sondergrössen; Layout kann auf Mobile/Zoom brechen | Übernehmen, unter "Veranstaltungen" oder Footer/Partnerbereich |
| Kontakte | Vorstand, SOFE, Hauswartung, Notfallnummern | `index.html` `#kontakt` | Tabellen enthalten viele direkte personenbezogene Kontaktdaten; Aktualität und Datenschutz prüfen | Übernehmen, neu strukturieren unter "Hilfe & Kontakt" |
| Interne Links | GitHub, mycloud, Zoho Mail | `index.html` `#login` | Kein echter Login; Link "GitHub Repository" wirkt Platzhalter | Übernehmen unter "Interner Bereich", Beschriftung korrigieren |
| News | Statische News-Seite | `news.html` | Verlinkt nicht vorhandene Blogseiten | Archivieren oder in "Veranstaltungen" integrieren |
| Easter Eggs | Versteckte Spiele | `easteregg.html`, `easteregg1.html`, `Jump.wav` | Kein Kerninhalt; sollte Redesign nicht prägen | Archivieren oder versteckt belassen |

## Vorgeschlagene Informationsarchitektur

### Startseite

Zweck: Ruhiger Einstieg in die Webermühle mit klarer Orientierung und wenigen priorisierten Wegen.

Empfohlene Inhalte:

- Hero mit Webermühle als Quartier-Signal, aber ohne abgeschnittene Inhalte
- Kurze Willkommen-Zeile mit Kennzahlen
- Drei bis fünf Hauptwege: Veranstaltungen, Räume, Quartier, Hilfe & Kontakt, Interner Bereich
- Aktuelle Hinweise oder nächste Veranstaltung, falls gepflegt
- Keine langen Volltextblöcke und keine grossen Galerie-Modals auf der Startseite

### Veranstaltungen

Zweck: Alles rund um Sommerfest, Jahresprogramm und saisonale Anlässe.

Einzuordnen:

- Sommerfest
- Anmeldung Sommerfest
- Jahresprogramm
- FUBATU / Football Tournament, falls aktuell
- Sponsoren mit Bezug zum Sommerfest
- Optional News statt separater `news.html`

### Räume

Zweck: Buchbare oder gemeinschaftlich genutzte Räume klar auffindbar machen.

Einzuordnen:

- Partyraum
- Rooftop
- Fitnessraum
- Fitness-Anmeldung
- Fitness-Regeln
- Link zur Fitness-Reservation unter `/fitness/`

Hinweis: Nicht-Fotosektionen sollen keine unnötigen Bild- oder Content-Modals erhalten. Für Räume sind Foto-Galerien sinnvoll, aber reduziert und klar zweckgebunden.

### Quartier

Zweck: Identität, Alltag und Angebote im Quartier.

Einzuordnen:

- Historie
- Vereine
- Laden
- Spielgruppe
- Bilder und Logos der Quartierakteure

### Hilfe & Kontakt

Zweck: Schneller Zugang zu Menschen, Downloads, Hauswartung und Notfallinformationen.

Einzuordnen:

- Kontakte Quartierverein
- Kontakte SOFE
- Hausmeister / CEBA
- Notfallnummern
- Downloads
- Beitrittsformular
- Vorstand-Aufstellung
- Fitness-PDF, falls es nicht bereits vollständig unter Räume eingeordnet ist

### Interner Bereich

Zweck: Geschützte oder organisatorische Links ohne falsche Login-Erwartung.

Einzuordnen:

- Fitnessraum-Reservation `/fitness/`
- Zoho Vereinsmail
- myCloud
- GitHub/Repository-Link, nur falls korrekt
- Admin-/Vereinslinks, falls sie öffentlich verlinkt werden sollen

## Zuordnung bestehender Inhalte

| Bestehender Inhalt | Neue Position | Umgang |
|---|---|---|
| Historie | Quartier | Kurzfassung auf Quartier-Seite, lange Fassung optional tiefer |
| Vereine | Quartier + Hilfe & Kontakt | Vereinsprofil bei Quartier, konkrete Kontakte bei Hilfe |
| Sommerfest | Veranstaltungen | Als Hauptinhalt übernehmen |
| Laden | Quartier | Kurz und praktisch darstellen |
| Partyraum | Räume | Eigene Raumkarte oder Detailbereich |
| Rooftop | Räume | Eigene Raumkarte oder Detailbereich; Bildpfade prüfen |
| Fitnessraum | Räume + Interner Bereich | Rauminfo unter Räume, Reservation prominent aber unverändert verlinken |
| Spielgruppe | Quartier | Eigener Angebotsbereich |
| Downloads | Hilfe & Kontakt | Thematisch gruppieren |
| Sponsoren | Veranstaltungen oder Footer | Bezug zum Sommerfest klar machen |
| Kontakte | Hilfe & Kontakt | Tabellen in mobilefreundliche Kontaktkarten überführen |
| Interne Links | Interner Bereich | Als Linkhub, nicht als "Login" beschriften |

## Inhalte, die vor Phase 2 geprüft werden sollten

- Sind alle Telefonnummern, E-Mail-Adressen und Rollen aktuell?
- Soll der GitHub-Link `https://github.com/dein-verein` ersetzt oder entfernt werden?
- Sind `news.html` und `rooftop.html` noch gewünscht oder Altlasten?
- Soll Google Translate erhalten bleiben oder durch klarere mehrsprachige Kerninhalte ersetzt werden?
- Soll der Besucherzähler sichtbar bleiben?
- Welche PDF-Dokumente sind für 2026 relevant und welche sind saisonal/abgelaufen?
- Soll `fitnessraum-kalender.html` noch verlinkt werden, obwohl `/fitness/` die neue Reservation enthält?
