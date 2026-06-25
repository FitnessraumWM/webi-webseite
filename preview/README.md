# Webi V2 Preview

Der Prototyp ist ein isolierter statischer Preview-Bereich.

Lokal öffnen:

```text
preview/index.html
preview/veranstaltungen.html
preview/raeume.html
preview/partyraum.html
preview/quartier.html
preview/geschichte.html
preview/hilfe-kontakt.html
preview/sponsoren.html
preview/downloads.html
preview/intern.html
preview/rueckblicke/gemeinsam-unterwegs.html
```

Es gibt kein Build-System und keine externen Abhängigkeiten.

## Geplante getrennte Bereiche

`Downloads & Formulare` und `Interner Bereich` bleiben getrennt.

- `Downloads & Formulare` ist eine öffentliche Seite für geprüfte Dokumente, Formulare und PDF-Dateien.
- `Interner Bereich` ist ein schlanker Link-Hub für bestehende interne Web-Links, ohne Downloads, PDF-Sammlung, Formulare, Login oder neue Funktionen.
- `Partner & Sponsoren` ist als öffentliche Preview-Seite vorhanden.
- `Downloads & Formulare` ist als öffentliche Preview-Seite vorhanden.
- `Interner Bereich` ist als schlanke Preview-Seite vorhanden.
- `Impressum` und `Datenschutz` werden im Footer erst aktiv verlinkt, wenn die jeweilige Preview-Seite vorhanden ist.

## Partyraum-Belegung – spätere Pflege

Die öffentliche Datei `preview/data/partyraum-belegung.json` enthält nur belegte Tage in `bookedDays`.

Späterer Ablauf:

```text
Partyraum TT.MM.JJJJ belegt
→ nach Bestätigung Datum in bookedDays eintragen

Partyraum TT.MM.JJJJ freigeben
→ nach Bestätigung Datum aus bookedDays entfernen
```

Vor jeder Änderung muss eine Bestätigung erfolgen. Die öffentliche JSON-Datei enthält nie Namen oder Buchungsdetails.

Private Buchungsdaten, Absagegründe und ein Änderungsverlauf gehören später ausschliesslich auf den WD-NAS.

Die öffentliche Anzeige darf erst aktualisiert werden, wenn die Änderung erfolgreich gespeichert wurde. Ein gelöschter öffentlicher Eintrag bedeutet automatisch wieder Frei.
