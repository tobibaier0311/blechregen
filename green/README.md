# Grüne BlechRegen-Website

Alle Befehle aus dem Repository-Stamm ausführen:

- `npm run dev:green`: lokale Vorschau auf Port 3004, Termin-Endpunkt intern auf 3006.
- `npm run build:green`: statischer Export nach `green/dist/`.
- `npm run test:green-events`: Tests für Konzertmeister-Adapter und Funktion.
- `node scripts/check-green-events.mjs`: Browserprüfung mit injizierten Testdaten.
- `node scripts/check-green.mjs`: allgemeine Browserprüfung der Website.

Browserprüfungen können über `GREEN_TEST_URL` gegen einen anderen Preview-Server
laufen. Quelldateien stehen unter `green/src/app/(frontend)/`, Bilder unter
`green/public/images/`. Keine generierten Dateien bearbeiten.

## Veröffentlichung

Die aktive `netlify.toml` im Repository-Stamm baut den grünen Export und bündelt
die vorbereitete Funktion aus `green/netlify/functions/`. Kein Deployment ohne
ausdrücklichen Auftrag des Nutzers.

Der Terminabruf bleibt deaktiviert, bis beide serverseitigen Variablen gesetzt
sind: `KONZERTMEISTER_EXPORT_URL` und
`KONZERTMEISTER_PUBLIC_EXPORT_CONFIRMED=true`. Vorher prüfen, dass alle Termine
im Export öffentlich sein dürfen. Den vollständigen signierten Link nicht
committen und nicht im Browser veröffentlichen. Lokal können die Variablen in
der ignorierten `green/.env.local` gesetzt werden; Vorlage: `green/.env.example`.
Danach den Entwicklungsserver neu starten.

Die Funktion stellt `/api/termine` bereit. Erfolgreiche Antworten haben
15 Minuten Netlify-CDN-Cache, Fehler werden nicht gecacht. Aktualisierung erfolgt
bei einem Abruf nach Cache-Ablauf, nicht durch einen Cronjob oder neuen Build.
Die Oberfläche lädt beim Öffnen und in sichtbaren Tabs regelmäßig nach. Bei
einem Aktualisierungsfehler bleiben bereits im Tab geladene Termine sichtbar;
ein dauerhafter, serverseitiger Ausfall-Backup-Speicher ist nicht eingerichtet.

Der Adapter liest derzeit das geprüfte deutsche HTML-Exportformat für Auftritte
(`types=2`, `lang=de`). Bei geändertem Format zeigt er einen Fehler statt einer
scheinbar leeren Liste. Beschreibungen, Teilnehmerangaben und fremde Skripte
werden nicht übernommen. Ein strukturierter öffentlicher Export wäre als
spätere Datenquelle vorzuziehen.

Impressum und Datenschutz sind noch Entwürfe. Das Buchungsformular bereitet
einen E-Mail-Entwurf vor und versendet selbst keine Nachricht.
