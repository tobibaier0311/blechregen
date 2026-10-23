# blechregen.de

Website und Redaktionssystem für BlechRegen auf Basis von Next.js, Payload CMS,
TypeScript und PostgreSQL.

## Statische Website für Netlify

Für die vorläufige Veröffentlichung ohne Payload, Datenbank und Server:

```bash
npm ci
npm run build:static
```

Der Ordner `dist/` enthält die vollständige Website einschließlich der Unterseiten
und Bilder. Du kannst diesen Ordner direkt bei Netlify Drop hochladen. Bei einem
Git-basierten Deployment liest Netlify die Einstellungen aus `netlify.toml`:
Build-Befehl `npm run build:static`, Veröffentlichungsordner `dist`.
Es werden keine Datenbank-Zugangsdaten oder sonstigen Umgebungsvariablen benötigt.

Öffentliche Texte, Kontaktdaten, Musiker, Termine und Galerien werden für diese
Version in `static/content.mjs` gepflegt. Die Ausgangstexte stammen aus der
bestehenden Startseiten-Vorlage. Es werden keine CMS-Daten automatisch übernommen.
Nach jeder Inhaltsänderung neu bauen und veröffentlichen. Termine werden beim
Build nach Datum gefiltert; auch nach vergangenen Veranstaltungen erneut bauen.
Bilder liegen unter `public/images/` und werden mitkopiert. Bei Galerien und
Porträts statische Bildpfade verwenden, keine Payload-API-Adressen.

Der E-Mail-Button öffnet das lokale Mailprogramm; die Website versendet selbst
keine Nachrichten. Der Redaktionsbereich ist im statischen Export nicht enthalten.
Die bestehende Payload-Anwendung bleibt mit `npm run dev` verfügbar. Der statische
Build arbeitet in `.static-site/` und verändert ihren Quellcode nicht.

Impressum und Datenschutz enthalten derzeit noch Entwurfshinweise und müssen vor
dem endgültigen Livegang vervollständigt werden. Musikerporträts und bestätigte
Termine können nachgetragen werden.

## Lokale Entwicklung

Voraussetzungen:

- Node.js 20.9 oder neuer
- npm 10 oder neuer
- Docker Desktop für die lokale PostgreSQL-Datenbank

Einrichtung und Start:

```bash
cp .env.example .env
docker compose up -d postgres
npm install
npm run dev
```

Danach sind die öffentliche Website unter <http://localhost:3000> und der
Payload-Redaktionsbereich unter <http://localhost:3000/admin> erreichbar. Beim
ersten Aufruf des Redaktionsbereichs wird das erste Administratorkonto angelegt.

Die lokale Datenbank verwendet ausschließlich Entwicklungszugangsdaten aus
`docker-compose.yml`. Für Produktion müssen eigene sichere Zugangsdaten und ein
neues `PAYLOAD_SECRET` gesetzt werden.

## Qualitätsprüfungen

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Geschützte Kundenvorschau

Die Vorschau wird in `.env` mit einmaligen, ausschließlich hierfür verwendeten
Zugangsdaten aktiviert:

```env
PREVIEW_PROTECTION=true
PREVIEW_USERNAME=blechregen
PREVIEW_PASSWORD=<selbst gesetztes Vorschaupasswort>
```

Codex kann Dateien im Projektordner technisch lesen. Persönliche oder anderweitig
verwendete Passwörter dürfen deshalb nicht in `.env` hinterlegt werden.

Anschließend werden Produktionsserver und Cloudflare Quick Tunnel in zwei
getrennten Terminals gestartet:

```bash
npm run build
npm run preview:serve
```

```bash
npm run preview:tunnel
```

Der Tunnel gibt eine zufällige HTTPS-Adresse unter `trycloudflare.com` aus. Der
Mac, Docker, PostgreSQL, der Produktionsserver und der Tunnel müssen während der
Kundenvorschau laufen. Der Payload-Adminbereich unter `/admin` verlangt nach der
Vorschau-Anmeldung zusätzlich ein persönliches Payload-Konto.

## Wichtige Verzeichnisse

- `src/app/(frontend)` – öffentliche Website
- `src/app/(payload)` – Payload-Adminbereich und API-Routen
- `src/collections` – Inhaltsmodelle und Benutzer
- `src/payload.config.ts` – zentrale Payload-Konfiguration
