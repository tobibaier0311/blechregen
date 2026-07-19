# blechregen.de

Website und Redaktionssystem für BlechRegen auf Basis von Next.js, Payload CMS,
TypeScript und PostgreSQL.

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
