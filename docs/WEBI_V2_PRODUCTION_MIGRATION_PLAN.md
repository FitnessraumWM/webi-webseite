# Webi V2 Produktions-Migrationsplan

Stand: 2026-06-25
Branch: redesign-webi-v2
Git-Stand: 9b4c61e

## Ausgangslage

Der Webi-V2-Bereich liegt vollständig unter `preview/` und ist aktuell von der bestehenden öffentlichen Website getrennt. Die bestehende Produktion im Root enthält weiterhin `index.html`, einzelne ältere HTML-Seiten, die Fitnessraum-Seiten, bestehende PDF-Dateien, lokale Bilder, `fitness/`, `OneSignalSDKWorker.js` und `CNAME`.

In Phase 4A werden keine Produktionsdateien geändert. Dieser Plan beschreibt nur, wie die spätere Übernahme vorbereitet, durchgeführt und geprüft werden soll.

## 1. Zielstruktur

Die folgende Zielstruktur passt zur bestehenden Repository-Struktur, weil die Produktion bereits statisch aus dem Root ausgeliefert wird und GitHub Pages mit `CNAME` auf `webi.family` zeigt.

```text
preview/index.html
→ index.html

preview/veranstaltungen.html
→ veranstaltungen.html

preview/raeume.html
→ raeume.html

preview/partyraum.html
→ partyraum.html

preview/quartier.html
→ quartier.html

preview/geschichte.html
→ geschichte.html

preview/hilfe-kontakt.html
→ hilfe-kontakt.html

preview/sponsoren.html
→ sponsoren.html

preview/downloads.html
→ downloads.html

preview/intern.html
→ intern.html

preview/rueckblicke/gemeinsam-unterwegs.html
→ rueckblicke/gemeinsam-unterwegs.html
```

Zusätzliche Zielordner für die spätere Produktion:

```text
preview/assets/css/webi-v2.css
→ assets/css/webi-v2.css

preview/assets/js/webi-v2.js
→ assets/js/webi-v2.js

preview/data/partyraum-belegung.json
→ data/partyraum-belegung.json
```

Vor der Übernahme muss geprüft werden, ob alte direkte Root-Seiten als eigenständige Dateien bestehen bleiben, ersetzt oder später weitergeleitet werden. Besonders wichtig sind `news.html`, `rooftop.html`, `fitness-anmeldung.html`, `fitnessraum-kalender.html`, `fitnessregeln.html` und `anmeldungSOFE.html`.

## 2. CSS-, JavaScript- und Asset-Plan

`webi-v2.css` soll später nach `assets/css/webi-v2.css` verschoben oder kopiert werden. Alle Produktionsseiten im Root sollen dann auf diesen Pfad zeigen:

```html
<link rel="stylesheet" href="assets/css/webi-v2.css">
```

`webi-v2.js` soll später nach `assets/js/webi-v2.js` verschoben oder kopiert werden. Alle Produktionsseiten im Root sollen dann auf diesen Pfad zeigen:

```html
<script src="assets/js/webi-v2.js" defer></script>
```

Die Seite unter `rueckblicke/` braucht weiterhin relative Pfade eine Ebene nach oben:

```html
<link rel="stylesheet" href="../assets/css/webi-v2.css">
<script src="../assets/js/webi-v2.js" defer></script>
```

Bildpfade müssen beim Wechsel aus `preview/` in den Root angepasst werden:

```text
Root-Seiten:
../logo-qv-schwarz.png → logo-qv-schwarz.png
../logo-qv-weiss.png → logo-qv-weiss.png
../webermuehle-gesamt.jpg → webermuehle-gesamt.jpg
../partyraum01.jpg → partyraum01.jpg
../rooftop-01.jpg → rooftop-01.jpg
../fitness01.jpg → fitness01.jpg

Seite in rueckblicke/:
../../logo-qv-schwarz.png → ../logo-qv-schwarz.png
../../sommerfest01.jpg → ../sommerfest01.jpg
```

Die bestehenden Logo-Dateien bleiben im Root:

```text
logo-qv-schwarz.png
logo-qv-weiss.png
verein-sofe-logo-w.png
zwergmuehle-logo.png
ceba-logo.jpg
Hydrior-logo.jpg
```

`verein-sofe-logo-s.png` soll nicht neu verlinkt werden, solange die helle SOFE-Version `verein-sofe-logo-w.png` für die entsprechenden Sommerfest- und SOFE-Bereiche verwendet wird.

Besonders zu prüfen nach der Migration:

- Header- und Footer-Logos in Light Mode und Dark Mode
- Partyraum-Galerie mit `partyraum01.jpg` bis `partyraum05.jpg`
- Rooftop-Bilder `rooftop-01.jpg` und `rooftop-02.jpg` auf der Räume-Seite
- Fitnessraum-Bilder `fitness01.jpg` und `fitness02.jpg`
- Rückblick-Galerien unter `rueckblicke/`
- Fotoansicht, Schliessen-Button, Escape-Taste und Fokus-Rückkehr

## 3. Schutz kritischer Bestandteile

Diese Bestandteile dürfen bei der späteren Migration nicht beschädigt, verschoben, gelöscht oder ohne separate Freigabe umgebaut werden:

```text
fitness/
fitness/index.html
OneSignalSDKWorker.js
CNAME
anmeldung_fitnessraum.pdf
Beitrittsformular_QV_2025.pdf
FUBATU.pdf
JahresprogrammQV_2025.pdf
Vorstand_Aufstellung-2025.pdf
fitness-anmeldung.html
fitnessraum-kalender.html
fitnessregeln.html
anmeldungSOFE.html
```

Die bestehenden Fitnessraum-Links müssen funktionsfähig bleiben:

```text
Belegungskalender ansehen → fitnessraum-kalender.html
Online-Anmeldung zum Fitnessraum → fitness-anmeldung.html
Anmeldeformular als PDF → anmeldung_fitnessraum.pdf
Fitness-Regeln → fitnessregeln.html
```

Die bestehende Fitness-App unter `fitness/` enthält externe Abhängigkeiten für OneSignal und Firebase. Diese App ist nicht Teil der Webi-V2-Migration und darf durch CSS-, JavaScript- oder Pfadänderungen im Root nicht beeinflusst werden.

`CNAME` muss unverändert `webi.family` enthalten.

## 4. Alte Direktlinks und Übergänge

### Beibehalten

Diese Ziele sollen in der späteren Produktion direkt erreichbar bleiben:

- `fitness/`
- `fitness/index.html`
- `fitness-anmeldung.html`
- `fitnessraum-kalender.html`
- `fitnessregeln.html`
- `anmeldung_fitnessraum.pdf`
- `anmeldungSOFE.html`
- `Beitrittsformular_QV_2025.pdf`
- `FUBATU.pdf`
- `JahresprogrammQV_2025.pdf`
- `Vorstand_Aufstellung-2025.pdf`
- lokale Bilddateien im Root
- `OneSignalSDKWorker.js`
- `CNAME`

### Später weiterleiten

Keine Weiterleitungen in Phase 4A bauen. Für die spätere Produktion sind diese Weiterleitungen sinnvoll zu planen:

- `news.html` → `veranstaltungen.html`
- `rooftop.html` → `raeume.html#rooftop`
- alte Direktlinks auf `index.html#partyraum` → `partyraum.html` oder `raeume.html#partyraum`
- alte Direktlinks auf `index.html#rooftop` → `raeume.html#rooftop`
- alte Direktlinks auf `index.html#fitness` → `raeume.html#fitnessraum`
- alte Direktlinks auf `index.html#spielgruppe` → `quartier.html#spielgruppe` oder `raeume.html#spielgruppe`
- alte Direktlinks auf `index.html#historie` → `geschichte.html`
- alte Direktlinks auf `index.html#downloads` → `downloads.html`
- alte Direktlinks auf `index.html#kontakt` → `hilfe-kontakt.html`
- alte Direktlinks auf `index.html#sponsoren` → `sponsoren.html`

### Später prüfen

Diese Ziele brauchen vor der echten Migration eine bewusste Entscheidung:

- `blog/neue-spielgruppe.html`, weil `news.html` darauf verweist, die Datei aber im Repository nicht vorhanden ist
- `blog/sommerfest-2025.html`, weil `news.html` darauf verweist, die Datei aber im Repository nicht vorhanden ist
- `easteregg.html` und `easteregg1.html`, weil sie nicht Teil der Preview-Informationsarchitektur sind
- `https://github.com/dein-verein`, weil der bestehende interne Link sehr generisch wirkt
- alle alten Kontaktbereiche aus `index.html`, damit keine bestätigte Kontaktperson verloren geht
- externe Zähler- und Übersetzungsdienste aus der alten Startseite, weil Webi V2 ohne externe Frameworks und ohne zusätzliche Dienste geplant ist
- alle bestehenden externen Sponsorenlinks vor dem Livegang

### Nicht mehr verlinken

Diese Ziele sollen in der Webi-V2-Navigation nicht neu sichtbar verlinkt werden:

- `verein-sofe-logo-s.png`, solange `verein-sofe-logo-w.png` die korrekte Logo-Version ist
- externe GitHub-Raw-URL für `zwergmuehle-logo.png`, da eine lokale Datei vorhanden ist
- `img/rooftop/01.jpg` bis `img/rooftop/10.jpg`, da diese Pfade im Repository nicht vorhanden sind
- alte Content-Anker, die durch neue Seiten ersetzt werden, sofern eine Weiterleitung oder ein neues Ziel definiert wurde

## 5. Footer, Impressum und Datenschutz

Im bestehenden Repository wurden keine funktionierenden Seiten für Impressum oder Datenschutz gefunden. In `index.html` gibt es keinen erkennbaren Impressum- oder Datenschutz-Link.

Für die spätere Produktion gilt:

- keine leeren Footer-Links auf Impressum oder Datenschutz einbauen
- keine rechtlichen Texte erfinden
- Impressum und Datenschutz erst aktiv verlinken, wenn die echten Inhalte und Pfade bestätigt sind
- Footer-Links auf bestehende Webi-V2-Seiten dürfen aktiv sein: `sponsoren.html`, `downloads.html`, `intern.html`

Offener Produktionspunkt:

```text
Impressum → echter Inhalt und Zielpfad fehlen
Datenschutz → echter Inhalt und Zielpfad fehlen
```

## 6. Partyraum-Belegung

Der vorbereitete Preview-Zustand liegt hier:

```text
preview/data/partyraum-belegung.json
```

Die spätere Produktionsdatei soll hier liegen:

```text
data/partyraum-belegung.json
```

Aktuelle öffentliche Struktur:

```json
{
  "schemaVersion": 1,
  "updatedAt": null,
  "bookedDays": []
}
```

Öffentliche Logik:

```text
Datum in bookedDays
→ Belegt

Datum nicht in bookedDays
→ Frei
```

Die öffentliche JSON-Datei enthält nie:

- Namen
- Buchungsgründe
- Telefonnummern
- E-Mail-Adressen
- Kommentare
- private Buchungsdetails
- Absagegründe
- Änderungsverlauf

Telegram- und WD-NAS-Integration ist ausdrücklich eine spätere separate Phase. Der Produktionsplan enthält keine Bot-, Backend-, Upload-, Kalender- oder Reservationsimplementierung.

## 7. Produktions-Testplan

Nach der späteren Migration muss mindestens in diesen Grössen geprüft werden:

- Desktop: 1366 × 768
- Desktop: 1280 × 800
- Desktop: 1024 × 768
- Tablet: 768 × 1024
- Mobile: 390 × 844
- Zoom: 125 %
- Zoom: 150 %
- Zoom: 200 %

Zusätzlich prüfen:

- keine horizontale Scrollbar
- keine Textüberdeckung
- Header und Footer auf jeder Seite
- Navigation auf jeder Seite
- Footer-Links auf `sponsoren.html`, `downloads.html` und `intern.html`
- alle Telefon-Links
- alle E-Mail-Links
- alle PDF-Links
- Fitnessraum-Belegung
- Online-Anmeldung Fitnessraum
- PDF-Anmeldung Fitnessraum
- Fitness-Regeln
- Partyraum-Kalender
- Partyraum-JSON ohne private Daten
- Galerien und Escape-Taste
- Fokus-Rückkehr nach geschlossener Fotoansicht
- Light Mode und Dark Mode
- Logos unverzerrt in beiden Modi
- `CNAME` bleibt vorhanden
- `OneSignalSDKWorker.js` bleibt im Root
- `fitness/` funktioniert unverändert
- GitHub Pages funktioniert nach Push
- alte Direktlinks und geplante Übergänge

## 8. Empfohlene Reihenfolge für die spätere Produktion

1. Produktions-Backup-Tag erstellen.
2. Produktionsdateien vorbereiten.
3. Zielordner `assets/css/`, `assets/js/`, `data/` und `rueckblicke/` vorbereiten.
4. Preview-Seiten in die Zielstruktur übernehmen.
5. CSS-, JavaScript- und Bildpfade anpassen.
6. Bestehende Fitnessraum-Seiten, PDFs, `fitness/`, `OneSignalSDKWorker.js` und `CNAME` unverändert lassen.
7. Lokalen Linkcheck für alle HTML-, Bild-, CSS-, JavaScript-, PDF- und Datenpfade ausführen.
8. Lokalen Responsive-Test durchführen.
9. Partyraum-Kalender mit leerer und testweise befüllter `bookedDays`-Struktur prüfen.
10. `git diff --check` ausführen.
11. Git-Diff vollständig prüfen.
12. Commit auf Arbeitsbranch erstellen.
13. Push auf Arbeitsbranch ausführen.
14. Review durchführen.
15. Merge oder Deployment erst nach Freigabe.
16. Live-Test auf `webi.family`.
17. Alte Direktlinks und geplante Übergänge prüfen.
18. Impressum und Datenschutz separat klären.

## Risiken

- Der Ersatz der Root-`index.html` kann alte Ankerlinks brechen, wenn keine Übergänge geplant werden.
- `news.html` verweist auf nicht vorhandene `blog/`-Dateien.
- `rooftop.html` verweist auf nicht vorhandene `img/rooftop/`-Bildpfade.
- Impressum und Datenschutz sind als echte Seiten oder Ziele noch nicht vorhanden.
- Die Fitness-App unter `fitness/` nutzt eigene externe Skripte und darf nicht mit Webi-V2-JavaScript vermischt werden.
- Relative Bildpfade müssen für Root-Seiten und `rueckblicke/` unterschiedlich angepasst werden.
- Externe Dienste der alten Website, etwa Übersetzung und Zähler, sind in Webi V2 nicht vorgesehen und brauchen vor der Ablösung eine bewusste Entscheidung.

## Offene Punkte vor der echten Migration

- Soll `news.html` dauerhaft weitergeleitet oder entfernt werden?
- Soll `rooftop.html` als Weiterleitung auf `raeume.html#rooftop` erhalten bleiben?
- Wie sollen alte Root-Ankerlinks behandelt werden?
- Werden Impressum und Datenschutz vor dem Livegang als eigene Seiten erstellt?
- Welche internen Links in `intern.html` sind final bestätigt?
- Sollen externe Zähler- oder Übersetzungsdienste aus der alten Website entfallen?
- Gibt es weitere externe Direktlinks, die ausserhalb des Repositorys bekannt sind?
