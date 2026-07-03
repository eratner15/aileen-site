# Deployment Guide

## Overview
EVAN Magazine is an Astro 5.x static site deployed to Cloudflare Workers + KV. The build produces static HTML/CSS/JS that is served via a Cloudflare Worker that maps `/magazine/*` URLs to KV-stored assets.

## Prerequisites
- Node.js 18+
- npm
- Cloudflare account with Workers + KV enabled
- Wrangler CLI (`npm install -g wrangler`)
- `wrangler login` completed

## Environment Variables
Create `.env` from `.env.example`:

| Variable | Purpose | Required |
|----------|---------|----------|
| `PUBLIC_GA_ID` | Google Analytics 4 measurement ID | No (events fire silently without it) |
| `PINTEREST_VERIFY` | Pinterest domain verification code | No |

## Build & Deploy

### Local Development
```bash
npm install
npm run dev          # http://localhost:4321/magazine/
```

### Production Build
```bash
npm run build        # Outputs to dist/
```

### Deploy to Cloudflare
```bash
npx wrangler deploy  # Uses wrangler.toml config
```

## Architecture

```
Browser → Cloudflare CDN → Worker (worker.js) → KV Static Assets
```

### Worker Behavior (`worker.js`)
1. Receives request for `/magazine/travel/best-restaurants-miami/`
2. Strips `/magazine` prefix → `/travel/best-restaurants-miami/`
3. Appends `index.html` for extensionless paths
4. Looks up asset in KV
5. On miss: serves `/404.html` with HTTP 404 status

### Key Files
| File | Purpose |
|------|---------|
| `astro.config.mjs` | Astro config: site URL, base path, sitemap |
| `wrangler.toml` | Cloudflare Worker config |
| `worker.js` | Request routing and KV asset serving |
| `src/content.config.ts` | Content schema (Zod validation) |

## Content Deployment
Content is Markdown files in `src/content/posts/{pillar}/`. To publish new content:

1. Add/edit `.md` file in the correct pillar directory
2. Ensure frontmatter passes Zod validation
3. `npm run build` (validates all content)
4. `npx wrangler deploy`

Or use the growth engine:
```bash
evan deploy --slug <slug>   # Copy draft to Astro content dir
evan publish                # Build + wrangler deploy
```

## Rollback
Cloudflare Workers supports instant rollback via the dashboard or:
```bash
npx wrangler rollback
```

## DNS & Domain
- Site: `cafecito-ai.com`
- Magazine path: `/magazine`
- Configured via Cloudflare DNS + Worker route
