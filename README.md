# AILEEN Magazine

A premium editorial publishing platform built on Astro, deployed to Cloudflare Workers at `cafecito-ai.com/magazine`.

## Architecture

```
aileen-site/           Astro 5 static site (frontend)
aileen-growth-engine/  Node.js CLI (content automation, AI Assist, voice engine)
```

### Stack
- **Frontend**: Astro 5.x with Content Layer API
- **Deployment**: Cloudflare Workers + KV static assets
- **Content**: Markdown files with Zod-validated frontmatter
- **AI**: Claude API via Anthropic SDK (growth engine)
- **Database**: SQLite (growth engine content pipeline)

## Quick Start

```bash
npm install
npm run dev       # Development server at localhost:4321
npm run build     # Build for production
npx wrangler deploy  # Deploy to Cloudflare
```

## Content System

All content lives in `src/content/posts/` organized by pillar:

```
src/content/posts/
├── travel/        restaurant guides, travel guides, hotel reviews
├── style/         style guides, the edit
├── recipes/       recipes
└── lifestyle/     articles
```

### Content Types
| Type | Description |
|---|---|
| `article` | General editorial content |
| `restaurant-guide` | Restaurant recommendations by city |
| `hotel-review` | Hotel reviews and where-to-stay guides |
| `travel-guide` | Destination travel guides |
| `style-guide` | Fashion and wardrobe guides |
| `recipe` | Recipes with structured ingredients/method |
| `the-edit` | Curated shopping/product roundups |
| `destination-hub` | Aggregation page for a destination |

### Key Frontmatter Fields

```yaml
title: "Post Title"
metaDescription: "150-160 chars"
targetKeyword: "primary seo keyword"
pillar: travel | style | recipes | lifestyle
contentType: article | restaurant-guide | hotel-review | ...
date: "2026-03-05"
image: "https://..."
imageAlt: "descriptive alt text"
imageCaption: "Optional caption"        # NEW
imageCredit: "Photo by ..."             # NEW
excerpt: "Card/dek text"
featured: false
cornerstone: false                       # NEW — pinned to top of category pages
relatedPosts: ["travel/boston-guide"]     # NEW — manual override (auto if empty)
ogTitle: "Custom OG title"              # NEW
ogDescription: "Custom OG description"  # NEW
canonicalOverride: "https://..."        # NEW
season: "summer"                        # NEW
newsletterCTAVariant: inline | bold | destination | shopping  # NEW
```

See `src/content.config.ts` for the full Zod schema.

## Documentation

| Document | Description |
|----------|-------------|
| [Deployment Guide](docs/deployment-guide.md) | Build, deploy, rollback procedures |
| [Analytics Event Map](docs/analytics-event-map.md) | All GA4 events with triggers and labels |
| [Component Inventory](docs/component-inventory.md) | All components with props and usage |
| [Route Map](docs/route-map.md) | Every route, file, and URL pattern |
| [Known Issues](docs/known-issues.md) | Current issues and planned enhancements |
| [Editor Guide](docs/editor-guide.md) | Content creation and editorial standards |

## SEO

- Server-rendered HTML (Astro SSG)
- JSON-LD: BlogPosting, BreadcrumbList, FAQPage, Recipe, WebSite, Organization
- XML sitemap (excludes admin pages)
- RSS feed with autodiscovery
- Canonical URLs (with override support), Open Graph, Twitter Cards
- Cornerstone content pinning on category pages
- Pinterest rich pin support

## Analytics Events (GA4)

| Event | Trigger |
|---|---|
| `outbound_click` | Affiliate/booking/reservation link click |
| `newsletter_signup` | Newsletter form submission |
| `toc_click` | Table of contents link click |
| `related_click` | Related post card click |
| `scroll_depth` | 25%, 50%, 75%, 100% scroll thresholds |
| `search` | Search query (debounced, 3+ chars) |

## Environment Variables

Copy `.env.example` to `.env` and fill in:
- `PUBLIC_GA_ID` — Google Analytics 4 measurement ID
- `PINTEREST_VERIFY` — Pinterest domain verification code

## Growth Engine CLI

```bash
aileen plan          # Weekly content plan
aileen write [id]    # AI-assisted draft
aileen deploy <slug> # Copy to Astro site
aileen publish       # Build + deploy
aileen pins [id]     # Pinterest pin copy
aileen audit [id]    # SEO audit
```
