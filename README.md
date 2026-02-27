# DNS Lab Frontend

React + Vite + TypeScript frontend for the DNS Spoofing Attack Simulation & Mitigation lab.

## Stack

- **React 18** + **TypeScript**
- **Vite** (dev server + build)
- **Tailwind CSS** — utility-first styling
- **Recharts** — charts for the report page
- **React Router v6** — client-side routing
- **Axios** — HTTP client with `/api` proxy
- **react-hot-toast** — notifications
- **framer-motion** — animations
- **lucide-react** — icons

## Features

- 🌐 **Multilingual**: English / Русский / Türkmen
- 🌓 **Dark / Light theme** (persisted in localStorage)
- 📊 **Dashboard** — live stats, mode switcher, recent events
- 🔍 **DNS Resolver** — resolve domains + target URL detection
- 🛡️ **Mitigation Policies** — CRUD for IP allowlists
- 📋 **Event Log** — filterable by severity, collapsible payload
- 📈 **Report** — bar charts, domain analysis, JSON download
- 🚀 **Demo** — full Safe→Attack→Mitigated simulation
- 💓 **Health** — backend status + API endpoint reference

## Development

```bash
npm install
npm run dev          # http://localhost:5173
```

The Vite dev server proxies `/api/*` → `http://localhost:3000/*`.

## Production (Docker)

Add to `infra/docker-compose.yml`:

```yaml
  frontend:
    build:
      context: ../frontend
      dockerfile: Dockerfile
    container_name: dns_lab_frontend
    ports:
      - '5173:80'
    depends_on:
      - api
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard with stats, mode switcher, events |
| `/dns` | DNS resolver with raw + target URL modes |
| `/mitigation` | Mitigation policy manager |
| `/events` | Filterable event log with JSON payloads |
| `/report` | Session report with charts + JSON export |
| `/demo` | Automated simulation runner |
| `/health` | Backend health check |

## API Integration

All backend endpoints are covered:

- `POST /sessions` · `GET /sessions/current` · `POST /sessions/:id/end`
- `GET /sessions/:id/summary`
- `POST /lab/:id/mode` · `POST /lab/:id/reset` · `GET /lab/:id/status`
- `POST /lab/:id/bootstrap` · `POST /lab/:id/quick-demo`
- `GET /dns/resolve` · `GET /dns/target-url`
- `GET /mitigation/:id/policies` · `PUT /mitigation/:id/policies`
- `GET /events`
- `GET /report/:id`
- `POST /demo/run`
- `GET /health`
