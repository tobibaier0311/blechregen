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

## Wichtige Verzeichnisse

- `src/app/(frontend)` – öffentliche Website
- `src/app/(payload)` – Payload-Adminbereich und API-Routen
- `src/collections` – Inhaltsmodelle und Benutzer
- `src/payload.config.ts` – zentrale Payload-Konfiguration
