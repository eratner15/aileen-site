# Artifact 1: Aileen Flywheel Architecture

## The Flywheel in One Sentence

Aileen's voice produces cluster-mapped content that compounds organic traffic, captures subscribers, generates affiliate revenue, and feeds data back into what to write next — each loop making the next one faster.

---

## System Map

```
                         ┌──────────────────────┐
                         │   VOICE ENGINE        │
                         │   (the constraint     │
                         │    that makes it all   │
                         │    sound like Aileen)  │
                         └──────────┬───────────┘
                                    │
                         ┌──────────▼───────────┐
                    ┌────│   CONTENT CREATION    │────┐
                    │    │   AI Assist + Editor   │    │
                    │    └──────────┬───────────┘    │
                    │               │                 │
                    │    ┌──────────▼───────────┐    │
                    │    │   CLUSTER ASSIGNMENT  │    │
                    │    │   category + dest +    │    │
                    │    │   internal links       │    │
                    │    └──────────┬───────────┘    │
                    │               │                 │
                    │    ┌──────────▼───────────┐    │
                    │    │   DISTRIBUTION        │    │
                    │    │   search + email +     │    │
                    │    │   Pinterest + social   │    │
                    │    └──────────┬───────────┘    │
                    │               │                 │
                    │    ┌──────────▼───────────┐    │
                    │    │   MONETIZATION        │    │
                    │    │   affiliate + booking  │    │
                    │    │   + ads + newsletter   │    │
                    │    └──────────┬───────────┘    │
                    │               │                 │
                    │    ┌──────────▼───────────┐    │
                    └────│   REFRESH LOOP        │────┘
                         │   data → gaps →       │
                         │   update → republish  │
                         └──────────────────────┘
```

---

## Loop 1: Voice → Content Creation

### What happens
Aileen (or AI Assist conditioned on her voice) produces a draft. The Voice Engine ensures every sentence sounds like her — not like generic SEO copy, not like an influencer, not like a content farm.

### Components involved
| Component | Location | Status |
|-----------|----------|--------|
| Voice Profile | `growth-engine/voice-profile.md` | EXISTS — prose only, needs structured format |
| Voice Rules | `growth-engine/src/agents/writer.js` BLOCKLIST | EXISTS — 15-word blocklist only |
| AI Assist (drafting) | `growth-engine/src/agents/writer.js` | EXISTS — single-prompt writer, no voice scoring |
| AI Assist (briefs) | `growth-engine/src/agents/planner.js` | EXISTS — generates briefs with keyword targets |
| Content Editor | None | MISSING — currently CLI + text editor |
| Voice Validator | None | MISSING — no automated voice scoring |

### How this strengthens the flywheel
Without voice consistency, content becomes generic. Generic content doesn't build a brand. Without a brand, there's no newsletter loyalty, no direct traffic, no reason to return. Voice is the moat.

### How this preserves voice
The Voice Engine is the gatekeeper for every piece of content. AI Assist drafts are voice-conditioned at the prompt level and voice-validated before deploy. Nothing ships that doesn't sound like Aileen.

### How this improves client ownership
Aileen's voice is codified as an asset she owns — not locked in someone's head or a WordPress plugin. She can hand the voice profile to any writer, any AI tool, any agency, and they can produce on-brand content.

### How this helps compounding
Every new piece of voice-consistent content reinforces the brand. Readers learn to trust the taste. Trust converts to subscribers. Subscribers convert to clicks. The voice is what makes content compound rather than just accumulate.

### What must be built
1. **Structured Voice Rules** (JSON config, not just prose) — see Artifact 2
2. **Voice Scoring** — automated check that grades a draft 0-100 on voice alignment
3. **Content-Type Voice Variants** — restaurant voice differs from recipe voice differs from newsletter voice
4. **Editor Preview** — see the post rendered in the actual site design before publishing

---

## Loop 2: Content Creation → Cluster Assignment

### What happens
When a post is created, it's assigned to a primary category, one or more destinations, and a topical cluster. The system identifies what internal links should exist, what related content to surface, and what cluster gaps remain.

### Components involved
| Component | Location | Status |
|-----------|----------|--------|
| Content Schema | `aileen-site/src/content.config.ts` | EXISTS — has `pillar` field only |
| Category Taxonomy | Implicit in pillar enum | EXISTS — 4 values: travel/style/recipes/lifestyle |
| Destination Taxonomy | None | MISSING — no destination model |
| Cluster Model | None | MISSING — no cluster/hub concept |
| Internal Link Resolver | `[slug].astro` related posts | EXISTS — basic same-pillar + random cross-pillar |
| Cluster Gap Analyzer | None | MISSING |

### What the build spec requires but doesn't exist yet
- **Destination taxonomy**: Miami, Palm Beach, NYC, Boston, Maine, Aspen, etc.
- **Destination hub pages**: `/magazine/destinations/miami/` aggregating restaurants + hotels + travel + style for that city
- **Category expansion**: Current 4 pillars → Restaurants, Travel, Hotels, Style, Recipes, The Edit
- **Subcategories**: best brunch in [city], best date night in [city], where to stay in [city]
- **Cluster model**: A "Miami cluster" groups all Miami restaurants + Miami hotels + Miami travel + Miami style + Miami destination hub
- **Internal link resolver**: Instead of random related posts, the system should know "best restaurants miami" must link to "where to stay miami", "miami travel guide", and "miami destination hub"

### How this strengthens the flywheel
Clusters create topical authority. Google rewards depth. A site with 1 Miami restaurant post is noise. A site with a Miami destination hub linking to 5 restaurant guides, 3 hotel reviews, 2 travel itineraries, and 2 style guides is an authority. Each new post in the cluster lifts every other post.

### How this preserves voice
Cluster assignment is structural, not editorial. It doesn't touch voice directly — but it ensures voice-consistent content is organized to compound rather than scatter.

### How this improves client ownership
Aileen can see her content organized by destination and category, understand her cluster depth at a glance, and make informed decisions about what to write next. WordPress buries this behind plugin chaos.

### How this helps compounding
Internal links pass authority. Clusters create topical relevance signals. Destination hubs become landing pages that rank for "[city] travel guide" while funneling traffic to deeper content. Every new post in a cluster strengthens the cluster, which strengthens every post in the cluster.

### What must be built
1. **Destination taxonomy** in content schema — `destinations: z.array(z.string()).default([])`
2. **Destination hub template** — aggregates all content tagged with a destination
3. **Category expansion** — add `restaurants`, `hotels`, `the-edit` to pillar enum (or create a separate `category` field)
4. **Cluster model** — define clusters in a config file or DB table; each cluster has a hub page, member posts, and gap list
5. **Smart related-content resolver** — ranked by: same destination + same category > same destination + adjacent category > same category cornerstone > editor override
6. **Persistent cluster modules** on post pages — "More in Miami", "Where to Stay", "What to Wear There"
7. **Cluster gap analyzer** in admin — shows "Miami cluster has 3 restaurant posts but 0 hotel posts"

---

## Loop 3: Cluster Assignment → Distribution

### What happens
Published content flows through distribution channels: organic search (automatic via indexing), email newsletter (The AILEEN Edit), Pinterest (8 pins per post), and social (Instagram/TikTok caption derivatives). Each channel has its own format but all drive traffic back to the site.

### Components involved
| Component | Location | Status |
|-----------|----------|--------|
| Organic (SEO) | Astro site + sitemap + structured data | EXISTS — working well |
| Newsletter | `growth-engine/src/agents/newsletter.js` | EXISTS — generates drafts, no send integration |
| Pinterest | `growth-engine/src/agents/pinner.js` | EXISTS — generates pin copy, no posting API |
| Social (IG/TikTok) | None | MISSING — no caption generator |
| RSS Feed | `aileen-site/src/pages/rss.xml.ts` | EXISTS |
| OG/Twitter meta | `aileen-site/src/layouts/Base.astro` | EXISTS |
| Pinterest meta | Base.astro `p:domain_verify` | EXISTS — empty, needs verification code |

### How this strengthens the flywheel
Content that isn't distributed doesn't compound. Organic search is the primary engine (80% of target traffic), but email creates direct return visits (immune to algorithm changes), Pinterest creates evergreen discovery (pins have 4-month half-life vs 48-hour for social), and social builds brand recognition that increases click-through rates on search results.

### How this preserves voice
Each channel gets a voice variant. Newsletter is slightly more intimate ("I've been meaning to tell you about..."). Pinterest is shorter and search-optimized but still Aileen's vocabulary. Social can be more casual. The Voice Engine provides channel-specific prompt conditioning.

### How this improves client ownership
Aileen sees all distribution status in one place. Instead of logging into WordPress + Mailchimp + Pinterest + Instagram separately, she sees "this post needs: newsletter copy, 8 pins, IG caption" and generates all derivatives from the admin.

### How this helps compounding
Pinterest pins from 6 months ago still drive traffic today. Newsletter subscribers return directly. Social followers convert to newsletter subscribers who convert to regular readers. Each channel feeds the others.

### What must be built
1. **Social caption generator** — new agent in growth engine for IG/TikTok captions
2. **Newsletter send integration** — connect to Mailchimp/ConvertKit API (or document manual flow)
3. **Pinterest API integration** — auto-post pins (or export to Tailwind/scheduling tool)
4. **Distribution status per post** — DB fields tracking: has_newsletter, has_pins, has_social
5. **Pinterest domain verification** — fill in `p:domain_verify` meta tag
6. **Article rich pins** — ensure OG tags satisfy Pinterest rich pin requirements
7. **Per-post distribution checklist** in admin — visual indicator of what's been distributed

---

## Loop 4: Distribution → Monetization

### What happens
Traffic converts to revenue through multiple paths: affiliate product links (style guides, hotel bookings), reservation CTAs (restaurant guides), newsletter subscriptions (future sponsorship revenue), and eventually display ads (Mediavine at 50K sessions).

### Components involved
| Component | Location | Status |
|-----------|----------|--------|
| Affiliate markers | `[AFFILIATE: description]` in post content | EXISTS — placeholder tags, no actual links |
| Product cards | None | MISSING — no structured commerce component |
| Booking CTAs | None | MISSING |
| Reservation CTAs | None | MISSING |
| Newsletter capture | Base.astro newsletter-cta section | EXISTS — form with no backend |
| Ad slots | None | MISSING — templates not designed for future ad insertion |
| Affiliate disclosure | None | MISSING |
| Click tracking | None | MISSING |

### How this strengthens the flywheel
Revenue funds content production. Affiliate data shows what readers actually buy, informing what products/destinations to cover. Newsletter list size enables sponsorship revenue independent of traffic volatility.

### How this preserves voice
Monetization must be editorial, not salesy. Product recommendations live inside the narrative ("The Khaite Eda sweater has become something of a modern classic" — that IS the affiliate surface). No "shop my link" energy. No interrupting the reading experience with commerce widgets mid-paragraph.

### How this improves client ownership
Aileen manages her own affiliate links, sees which posts generate clicks, and controls product recommendations. No dependency on a managed service or agency for revenue.

### How this helps compounding
As traffic grows, affiliate revenue grows proportionally. At 50K sessions, Mediavine display ads add a base revenue layer. Newsletter list enables sponsorship deals. Multiple revenue streams compound independently.

### What must be built
1. **Product card component** — styled for editorial feel (image, name, brand, price, link)
2. **Product grid component** — "Shop the Edit" section at post bottom
3. **Booking CTA component** — hotel booking links with tracking params
4. **Reservation CTA component** — restaurant reservation links (OpenTable, Resy)
5. **Affiliate disclosure component** — FTC-compliant, tastefully designed
6. **Newsletter form backend** — connect to email provider API
7. **Outbound click tracking** — GA4 events for affiliate/booking/reservation clicks
8. **Ad-ready templates** — paragraph rhythm and content width designed to accommodate future Mediavine units without layout breakage
9. **Monetization fields in content schema** — `affiliateDisclosure: boolean`, `products: array`, `bookingLinks: array`

---

## Loop 5: Monetization → Refresh Loop

### What happens
Data from analytics, search console, and affiliate performance identifies: which pages are driving revenue, which pages are losing rankings, which pages have weak internal links, which clusters have gaps, and what to publish or refresh next.

### Components involved
| Component | Location | Status |
|-----------|----------|--------|
| SEO Auditor | `growth-engine/src/agents/auditor.js` | EXISTS — LLM-based audit with score |
| Content Planner | `growth-engine/src/agents/planner.js` | EXISTS — weekly 3-post plan from keyword bank |
| Keyword Bank | `growth-engine/seeds/keywords.json` + `keywords.md` | EXISTS |
| Performance Snapshots | `growth-engine/db/schema.sql` snapshots table | EXISTS — schema only, no data collection |
| GSC Integration | None | MISSING |
| GA4 Integration | None | MISSING |
| Refresh Queue | `existing_posts.needs_refresh` + `refresh_priority` | EXISTS — DB fields, no automated population |

### How this strengthens the flywheel
The refresh loop is what turns linear content production into exponential growth. Without it, old posts decay. With it, every post is a living asset that gets stronger over time.

### How this preserves voice
Refreshed content goes through the same voice validation as new content. AI Assist generates refresh suggestions; Aileen reviews and approves. Voice consistency is maintained even as content evolves.

### How this improves client ownership
Aileen doesn't need to guess what to work on. The system tells her: "Your Palm Beach restaurant guide dropped from position 4 to position 9. Here's what to update. Your Miami cluster is missing a hotel review — here's a brief." She becomes a strategic editor, not a hamster on a content treadmill.

### How this helps compounding
Refreshed content that recovers rankings is the highest-ROI activity in content marketing. A 30-minute update to an existing post can recover more traffic than a new 2,000-word post. The refresh loop ensures nothing rots.

### What must be built
1. **GSC data import** — pull search performance data (rankings, impressions, clicks) into the DB
2. **GA4 data import** — pull traffic data per page into snapshots
3. **Automated refresh scoring** — flag posts where: ranking dropped, traffic declined, no updates in 90+ days, missing internal links, missing FAQs
4. **Refresh brief generator** — AI Assist produces specific refresh instructions: "add 2 new restaurants, update prices, add FAQ section, link to new Palm Beach guide"
5. **Striking distance identifier** — posts ranking positions 5-20 that need small pushes to page 1
6. **Cluster gap detector** — "You have 4 Miami restaurant posts but 0 Miami hotel posts. Recommended: 'Where to Stay in Miami' targeting 'best hotels miami 2026' (vol: 3200, diff: 28)"
7. **Content calendar with refresh slots** — not just new posts; also scheduled refreshes

---

## Loop 6: Refresh → Voice (Full Circle)

### What happens
The refresh loop feeds back into the Voice Engine. As more content is published, the voice corpus grows. AI Assist gets better at matching Aileen's voice because there are more examples to learn from. Refreshed content ensures the voice corpus stays current — not frozen in how she wrote 2 years ago.

### How this closes the flywheel
- More content → better voice model → faster content creation → more content
- Better clustering → more internal links → stronger rankings → more traffic → more data → better clustering
- More traffic → more newsletter signups → more direct traffic → less algorithm dependency
- More affiliate data → better product recommendations → higher conversion → more revenue → more content investment

---

## Current State vs. Target State

| Flywheel Component | Current State | Target State |
|---|---|---|
| Voice Engine | Prose file + 15-word blocklist | Structured rules + scoring + type variants + validation |
| Content Creation | CLI writer agent, single-prompt | Editor UI + AI Assist with briefs/outlines/rewrites + preview |
| Content Schema | 4 pillars, flat posts | Categories + destinations + clusters + structured types |
| Internal Linking | Random same-pillar + 1 cross | Smart cluster-aware resolver with manual override |
| Destination Hubs | Don't exist | Hub pages aggregating all content per destination |
| Distribution | Pin copy + newsletter draft (no send) | Integrated email send + Pinterest posting + social captions |
| Monetization | `[AFFILIATE]` placeholder tags | Product cards + booking CTAs + click tracking + disclosure |
| Newsletter | Form with no backend | Connected to email provider, variant CTAs, signup tracking |
| Analytics | None | GA4 + GSC + custom events + performance dashboards |
| Refresh Loop | Manual `aileen audit` via CLI | Automated scoring + refresh queue + striking distance alerts |
| Admin Experience | Terminal CLI | Web-based dashboards (see Artifact 3) |
| Client Ownership | Requires developer for most operations | Self-service publishing, monitoring, and optimization |

---

## Implementation Priority

The flywheel should be built from the inside out: voice first, then creation, then structure, then distribution, then monetization, then data/refresh.

| Priority | Component | Why First |
|---|---|---|
| 1 | Voice Engine (Artifact 2) | Everything downstream depends on voice consistency |
| 2 | Content Schema + Destinations | Architecture must exist before content can be properly clustered |
| 3 | Admin Editor + AI Assist | Aileen needs to be able to publish without developer help |
| 4 | Internal Linking + Cluster Logic | This is what makes content compound instead of just accumulate |
| 5 | Newsletter Integration | Email is the owned distribution channel; reduces Google dependency |
| 6 | Monetization Components | Revenue funds everything else |
| 7 | Analytics + Dashboards | Data closes the loop; refresh cycle begins |
| 8 | Pinterest/Social Automation | Scale distribution once the content machine is running |
