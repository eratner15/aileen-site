# Route Map

Base URL: `https://cafecito-ai.com/magazine`

## Public Pages

| Route | File | Description |
|-------|------|-------------|
| `/magazine/` | `src/pages/index.astro` | Homepage: hero, editor's picks, popular guides, clusters, destinations, latest |
| `/magazine/travel/` | `src/pages/travel/index.astro` | Travel pillar: featured, cornerstone guides, all posts |
| `/magazine/style/` | `src/pages/style/index.astro` | Style pillar: featured, cornerstone guides, all posts |
| `/magazine/recipes/` | `src/pages/recipes/index.astro` | Recipes pillar: featured, cornerstone recipes, all posts |
| `/magazine/lifestyle/` | `src/pages/lifestyle/index.astro` | Lifestyle pillar: featured, cornerstone guides, all posts |
| `/magazine/restaurants/` | `src/pages/restaurants/index.astro` | All restaurant guides (cross-pillar) |
| `/magazine/hotels/` | `src/pages/hotels/index.astro` | All hotel reviews (cross-pillar) |
| `/magazine/the-edit/` | `src/pages/the-edit/index.astro` | The Edit / shopping roundups |
| `/magazine/destinations/` | `src/pages/destinations/index.astro` | Destination directory |
| `/magazine/destinations/[dest]/` | `src/pages/destinations/[destination].astro` | Destination hub: clustered posts + newsletter CTA |
| `/magazine/[pillar]/[slug]/` | `src/pages/[pillar]/[slug].astro` | Article/guide detail page |
| `/magazine/about/` | `src/pages/about.astro` | About page |
| `/magazine/search/` | `src/pages/search.astro` | Client-side search |
| `/magazine/subscribe/` | `src/pages/subscribe.astro` | Newsletter signup page |
| `/magazine/404/` | `src/pages/404.astro` | 404 error page (served by worker for unknown routes) |

## Admin Pages (noindex)

| Route | File | Description |
|-------|------|-------------|
| `/magazine/admin/` | `src/pages/admin/index.astro` | Editorial dashboard |
| `/magazine/admin/seo/` | `src/pages/admin/seo.astro` | SEO scorecard |
| `/magazine/admin/opportunities/` | `src/pages/admin/opportunities.astro` | Content gap analysis |
| `/magazine/admin/distribution/` | `src/pages/admin/distribution.astro` | Distribution status |
| `/magazine/admin/monetization/` | `src/pages/admin/monetization.astro` | Monetization dashboard |
| `/magazine/admin/performance/` | `src/pages/admin/performance.astro` | Performance tracker |
| `/magazine/overview/` | `src/pages/overview.astro` | Site overview / documentation |

## Generated Files

| Route | Source | Description |
|-------|--------|-------------|
| `/magazine/rss.xml` | `src/pages/rss.xml.ts` | RSS feed |
| `/magazine/sitemap-index.xml` | `@astrojs/sitemap` | XML sitemap (excludes admin/overview) |
| `/magazine/robots.txt` | `public/robots.txt` | Robots directives |

## Dynamic Route Patterns

### `[pillar]/[slug]`
Generated from `src/content/posts/{pillar}/{slug}.md`. Each non-draft post produces a page.

### `destinations/[destination]`
Hardcoded list: miami, palm-beach, boston, nyc, maine, aspen, nantucket, hamptons, italy, colorado.
