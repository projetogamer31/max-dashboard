# Mission Control Dashboard

Mission Control is a Next.js 14 (App Router) dashboard for monitoring multiple OpenClaw gateways. It runs on Vercel and proxies all gateway traffic through a Bridge API so browser clients never see gateway tokens.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

```bash
cp .env.example .env.local
```

Set:
- `BRIDGE_BASE_URL` (Bridge API base URL on the Max VPS)
- `BRIDGE_API_KEY` (Bridge API key)

3. Run locally:

```bash
npm run dev
```

The dashboard will be at `http://localhost:3000`.

## Deploy to Vercel

1. Push this repo to your Git provider.
2. Import the project in Vercel.
3. Add `BRIDGE_BASE_URL` and `BRIDGE_API_KEY` as project environment variables.
4. Deploy.

## Bridge API Contract

The API routes in `app/api/*` proxy to the Bridge API and require the following endpoints:

- `GET /v1/gateways`
- `GET /v1/gateways/:id/sessions`
- `GET /v1/gateways/:id/cron`
- `POST /v1/gateways/:id/cron/:jobId/run`
- `GET /v1/gateways/:id/logs?limit=200`

All Bridge requests require header `X-API-Key`.
