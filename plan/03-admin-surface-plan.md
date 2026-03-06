# Artifact 3: Admin Surface Plan

## Purpose

The admin surface is what makes the difference between "a nice website Aileen needs a developer to update" and "a publishing operating system Aileen runs herself." Every dashboard, editor tool, and CMS control listed here must make the flywheel easier to operate and eliminate dependency on developer intervention.

WordPress gave her a publishing UI buried under plugin chaos. This must be simpler, faster, and more useful.

---

## Architecture Decision: Where Does Admin Live?

### Option A: Astro + API Routes (Recommended)
- Admin pages live at `/magazine/admin/*` as Astro pages
- API routes handle data mutations (publish, update, score, etc.)
- Growth engine runs as a background service or is called via API
- SQLite DB is the shared data layer
- Cloudflare Workers can proxy admin routes with auth

### Option B: Separate Admin App
- Standalone React/Next.js app at `admin.cafecito-ai.com`
- Communicates with growth engine API
- More complex deployment, but cleaner separation

### Option C: CLI-First with Web Dashboard (Near-Term)
- Growth engine CLI remains the primary interface for content operations
- Astro site serves read-only dashboards that visualize DB state
- Lowest implementation cost, highest leverage for current stage

**Recommendation**: Start with Option C (CLI + read-only dashboards), evolve to Option A as the content operation scales. The CLI already works; dashboards add visibility without rebuilding the workflow.

---

## Dashboard 1: Editorial Dashboard

### URL: `/magazine/admin/`

### What it shows
The command center. Everything Aileen needs to see at a glance when she sits down to work.

### Sections

**Content Pipeline**
| Field | Source |
|---|---|
| All posts by status (Planned → Drafted → In Review → Published) | `content_calendar` table |
| Color-coded by pillar | `pillar` field |
| Days since last update | `updated_at` field |
| Draft word count | `word_count` field |
| Voice score (when available) | `voice_score` field (new) |

**This Week's Plan**
| Field | Source |
|---|---|
| 3 planned posts with keyword + pillar + word count | `content_calendar WHERE status='planned'` |
| Status indicators: drafted / pins created / published | Join across tables |
| Brief preview (expandable) | `brief` JSON field |

**Recently Published**
| Field | Source |
|---|---|
| Last 10 published posts | `content_calendar WHERE status='published'` |
| Published date | `published_at` |
| Link to live page | `published_url` |

**Stale Content Alerts**
| Field | Source |
|---|---|
| Posts not updated in 90+ days | `existing_posts.last_scraped` or content `updatedDate` |
| Posts missing hero image | `image` field empty/placeholder |
| Posts missing FAQ section | Content body check |
| Posts missing updated date | `updatedDate` field |

### How this strengthens the flywheel
Aileen sees exactly what to work on today. No guessing, no logging into 5 different tools. Reduces the friction between "I have 30 minutes" and "I improved my site."

### How this preserves voice
Pipeline view shows voice score for every draft — she can prioritize editing low-score drafts that need the most voice work.

### How this improves client ownership
She operates her content business from one screen. WordPress required navigating Posts → All Posts → filter → sort → open each one.

---

## Dashboard 2: SEO Dashboard

### URL: `/magazine/admin/seo/`

### What it shows
Technical SEO health and content quality indicators.

### Sections

**SEO Health Scorecard**
| Check | Method | Status |
|---|---|---|
| Missing meta title | Frontmatter `title` empty or >60 chars | Red/Green per post |
| Missing meta description | `metaDescription` empty or >160 chars | Red/Green |
| Missing OG image | `image` is placeholder URL | Red/Green |
| Missing alt text | `imageAlt` empty | Red/Green |
| Missing target keyword | `targetKeyword` empty | Red/Green |
| Keyword not in title | Compare `targetKeyword` vs `title` | Red/Green |
| Keyword not in H2s | Parse content for H2s containing keyword | Red/Green |
| Thin content | Word count < 800 | Yellow |
| Missing internal links | <3 internal links in body | Yellow |

**Category/Destination Coverage**
| Field | Source |
|---|---|
| Posts per pillar (bar chart) | Content collection grouped by pillar |
| Posts per destination (when taxonomy exists) | `destinations` field |
| Pillar gaps: which pillar has fewest posts | Computed |

**Audit Scores**
| Field | Source |
|---|---|
| SEO audit score per post | `seo_scores` table |
| Posts scored below 70 (needs attention) | Filter |
| Posts never audited | Left join |
| "Run Audit" action button | Triggers `aileen audit` |

**Internal Link Map**
| Field | Source |
|---|---|
| Which posts link to which | Parse markdown for internal `href` |
| Orphaned posts (no inbound links) | Posts with 0 inbound |
| Hub pages with <5 linked posts | Destination hubs |

### How this strengthens the flywheel
SEO is the primary traffic engine (80% target). Systematic SEO health monitoring ensures no post is leaving traffic on the table due to a missing meta description or broken internal link.

### How this preserves voice
Indirectly — SEO dashboard ensures voice-consistent content is technically optimized to be found. Great voice with bad SEO is great writing that nobody reads.

### How this improves client ownership
Aileen can identify and fix SEO issues without hiring an SEO consultant. The dashboard tells her exactly what's wrong and what to fix first.

---

## Dashboard 3: Content Opportunities

### URL: `/magazine/admin/opportunities/`

### What it shows
What to publish next, based on data rather than guessing.

### Sections

**Keyword Bank**
| Field | Source |
|---|---|
| Top 20 unused keywords ranked by opportunity score | `keywords` table, `opportunity_score = volume / difficulty` |
| Volume, difficulty, current ranking (if any) | `keywords` table |
| Suggested pillar | `pillar` field |
| "Generate Brief" action | Triggers `aileen plan` for specific keyword |

**Cluster Gaps** (future — requires destination taxonomy)
| Field | Source |
|---|---|
| Destinations with content count | Group by destination |
| Missing content types per destination | Cross-join destinations × content types |
| Example: "Miami has 3 restaurant guides but 0 hotel reviews" | Gap analysis |
| Recommended next post with keyword suggestion | AI-generated |

**Striking Distance** (future — requires GSC data)
| Field | Source |
|---|---|
| Posts ranking positions 5-20 | GSC import |
| Current impressions + clicks | GSC data |
| Recommended action (add FAQ, expand, refresh) | AI-generated |

**Follow-Up Suggestions**
| Field | Source |
|---|---|
| For each recently published post, 2-3 follow-up ideas | AI-generated based on cluster logic |
| Content type suggestion | Based on gap analysis |
| Estimated keyword opportunity | From keyword bank |

### How this strengthens the flywheel
This is the "what to write next" engine. Instead of Aileen thinking "hmm, what should I write about?", the system tells her "your Miami cluster needs a hotel review targeting 'best hotels miami' (vol: 3200, diff: 28)."

### How this preserves voice
Opportunity suggestions are strategic, not editorial. They identify what topics to cover; the Voice Engine determines how to cover them.

### How this improves client ownership
Aileen becomes a strategic editor. She makes informed decisions about where to invest her time based on data, not gut feel.

### How this helps compounding
Every post fills a gap that strengthens a cluster. Clusters compound authority. Authority compounds rankings. Rankings compound traffic. This dashboard ensures every new post is placed for maximum compound effect.

---

## Dashboard 4: Distribution Dashboard

### URL: `/magazine/admin/distribution/`

### What it shows
Which posts have been distributed through which channels, and what's missing.

### Sections

**Distribution Status per Post**
| Channel | Check | Source |
|---|---|---|
| Newsletter | Has newsletter derivative been created? | `distribution_status` field or separate table |
| Pinterest | Have pins been generated? How many? | `pins` table |
| Instagram | Has IG caption been generated? | `social_derivatives` table (new) |
| TikTok | Has TikTok caption been generated? | `social_derivatives` table |

**Visual: Distribution Completeness Grid**
A matrix: rows = posts (last 20), columns = channels. Green = done, gray = not done. Aileen can see at a glance "oh, my last 5 posts have no Pinterest pins" and batch-generate them.

**Pinterest Status**
| Field | Source |
|---|---|
| Total pins generated | `pins` table count |
| Pins per post average | Computed |
| Posts with 0 pins | Filter |
| "Generate Pins" batch action | Triggers `aileen pins` for selected posts |

**Newsletter Status**
| Field | Source |
|---|---|
| This week's newsletter: drafted / not drafted | Check for recent newsletter output |
| Subject line preview | From newsletter draft |
| Posts featured in newsletter | From draft content |
| "Draft Newsletter" action | Triggers `aileen newsletter` |

### How this strengthens the flywheel
Content that isn't distributed doesn't compound. This dashboard ensures no post is published without being pushed through all relevant channels.

### How this preserves voice
Each channel derivative is generated through channel-specific voice variants (Component 3 of Voice Engine). The dashboard ensures derivatives exist, the Voice Engine ensures they sound right.

### How this improves client ownership
Instead of logging into WordPress + Mailchimp + Pinterest + Instagram separately, Aileen sees all distribution status in one view and generates missing derivatives with one click.

---

## Dashboard 5: Monetization Dashboard

### URL: `/magazine/admin/monetization/`

### What it shows
Revenue-generating content and opportunities to add monetization to existing content.

### Sections

**Monetization Coverage**
| Field | Source |
|---|---|
| Posts with affiliate blocks | Content body scan for `[AFFILIATE:]` tags or product components |
| Posts with booking CTAs | Content body scan for booking links |
| Posts with reservation CTAs | Content body scan for reservation links |
| Posts missing monetization where relevant | Filter monetizable content types (restaurant, hotel, style) without monetization |

**Affiliate Link Inventory**
| Field | Source |
|---|---|
| All affiliate placeholders | Parse `[AFFILIATE: ...]` tags from content |
| Status: placeholder vs. live link | Check if actual URL is present |
| Posts with most affiliate opportunities | Ranked by count |

**Revenue-Ready Readiness**
| Milestone | Status |
|---|---|
| Affiliate disclosure component | Built / Not built |
| Product card component | Built / Not built |
| Booking CTA component | Built / Not built |
| Click tracking (GA4 events) | Implemented / Not implemented |
| Mediavine threshold (50K sessions) | Current sessions / 50K |

### How this strengthens the flywheel
Revenue funds content production. This dashboard ensures monetization isn't an afterthought — every relevant post has appropriate (non-intrusive) revenue opportunities.

### How this preserves voice
The dashboard identifies where monetization modules should exist but doesn't change how they're presented. The Voice Engine ensures affiliate mentions stay editorial, not salesy.

### How this improves client ownership
Aileen sees her revenue infrastructure at a glance. She can batch-convert `[AFFILIATE: placeholder]` tags into live links without a developer.

---

## Dashboard 6: Performance Dashboard

### URL: `/magazine/admin/performance/`

### What it shows
Traffic, engagement, and growth metrics. This is the "is the flywheel working?" dashboard.

### Sections

**50K Session Goal Tracker**
| Field | Source |
|---|---|
| Current monthly sessions | GA4 import or manual entry |
| Progress bar to 50K | Computed |
| Month-over-month growth rate | Historical snapshots |
| Projected month to hit 50K | Extrapolation |

**Top Pages**
| Field | Source |
|---|---|
| Top 20 pages by sessions | GA4 data or `performance_snapshots` table |
| Sessions, pageviews, avg time on page | GA4 |
| Trend: up/down/flat vs prior period | Comparison |

**Top by Dimension**
| Field | Source |
|---|---|
| Top destinations by traffic | Aggregate by destination tag |
| Top pillars by traffic | Aggregate by pillar |
| Top posts driving newsletter signups | GA4 events |
| Top posts driving outbound clicks | GA4 events |

**Refresh Priority Queue**
| Field | Source |
|---|---|
| Posts sorted by refresh priority | `existing_posts.refresh_priority` |
| Reason for refresh | Ranking drop, stale date, missing links |
| Last refreshed date | `updated_at` |
| "Generate Refresh Brief" action | Triggers AI refresh suggestions |

### Data Source Strategy (Phased)

**Phase 1 (Now)**: Manual entry. Aileen tells the system "I got 18K sessions this month" and it's stored in `performance_snapshots`. Dashboard shows trend from manual data points.

**Phase 2 (Month 2-3)**: GSC data import. `aileen import-gsc` pulls search performance data. Rankings, impressions, clicks per page.

**Phase 3 (Month 4+)**: GA4 data import. Full traffic data per page. Automated refresh scoring based on performance trends.

### How this strengthens the flywheel
This closes the loop. Performance data → identifies what's working → informs what to publish next → feeds back into content creation. Without this dashboard, the flywheel is open-loop.

### How this preserves voice
Performance data doesn't touch voice directly, but it validates that voice-consistent content is also traffic-generating content. If high-voice-score posts also rank well, the system is working.

### How this improves client ownership
Aileen sees her business metrics without logging into GA4, GSC, or asking a consultant for a report. The data is actionable — not just "you got 18K sessions" but "your Palm Beach guide dropped from position 4 to 9, here's what to update."

---

## Editor Tools (Future — Phase 2+)

These are the content creation and editing tools that live inside the admin experience. They replace "SSH into server, run CLI command, copy-paste output."

### Tool 1: AI Draft Generator

**What it does**: Generate a full draft from a brief + keyword + content type.

| Input | Source |
|---|---|
| Title | User input or keyword bank suggestion |
| Target keyword | User input or keyword bank |
| Content type | Dropdown: restaurant guide, style post, travel guide, etc. |
| Pillar | Auto-assigned from content type or manual |
| Destination | Dropdown (when taxonomy exists) |
| Brief notes | Optional free text |

| Output | Display |
|---|---|
| Full markdown draft | Rendered preview |
| Voice score | Badge: green (75+), yellow (50-74), red (<50) |
| SEO check results | Inline indicators |
| Suggested improvements | Sidebar panel |

**Action buttons**: Edit → Save as Draft → Deploy to Site → Publish

### Tool 2: Content Editor

**What it does**: Edit existing content with AI assistance.

| Feature | Description |
|---|---|
| Markdown editor | Split-pane: source + preview |
| AI Rewrite Block | Select text → "Rewrite in Aileen's voice" |
| AI Expand | Select H2 → "Expand this section" |
| AI FAQ Generator | "Suggest FAQ questions for this post" |
| AI Internal Links | "Suggest internal links from existing content" |
| Voice Score | Live score that updates as content changes |
| SEO Sidebar | Meta title, description, keyword, OG image fields |
| Preview | See post rendered in actual site design |

### Tool 3: Bulk Operations

| Operation | Description |
|---|---|
| Batch Pin Generation | Select 5 posts → generate pins for all |
| Batch Newsletter | Select 3 posts → generate newsletter featuring all |
| Batch Social Captions | Select 5 posts → generate IG + TikTok for all |
| Batch Voice Check | Select 10 posts → score all, rank by voice quality |
| Batch Deploy | Select 3 drafts → deploy all to Astro site |

### Tool 4: Image Management

| Feature | Description |
|---|---|
| Upload images | Drag-and-drop to Cloudflare R2 or local |
| Auto-generate alt text | AI Assist suggests alt text from image content |
| Hero image picker | Browse uploaded images, assign to posts |
| Image optimization | Auto-resize for web (1200px max width, WebP) |

---

## CMS Controls

These are the content management fields that Aileen can edit per post, beyond the body content.

### Post-Level Controls

| Field | Type | Purpose |
|---|---|---|
| title | text | Post title (also meta title source) |
| metaDescription | text (160 char) | SEO meta description |
| targetKeyword | text | Primary SEO keyword |
| pillar | enum | travel / style / recipes / lifestyle |
| destinations | multi-select | Miami, Palm Beach, NYC, Boston, etc. |
| contentType | enum | article / restaurant-guide / hotel-review / style-guide / recipe / travel-guide / the-edit |
| date | date | Original publish date |
| updatedDate | date | Last meaningful update |
| image | URL/upload | Hero image |
| imageAlt | text | Alt text for hero image |
| excerpt | text | Dek/subtitle for cards |
| draft | boolean | Draft vs. published |
| featured | boolean | Show on homepage hero |
| featuredOrder | number | Homepage position (1 = lead) |
| affiliateDisclosure | boolean | Show affiliate disclosure |
| faq | structured array | Q&A pairs for FAQ schema |
| relatedPosts | array of slugs | Manual override for related content |
| products | structured array | Product cards (name, brand, price, link, image) |
| bookingLinks | structured array | Hotel booking CTAs |
| reservationLinks | structured array | Restaurant reservation CTAs |
| voiceScore | number (0-100) | Auto-populated by validator |
| seoScore | number (0-100) | Auto-populated by auditor |
| pinsGenerated | number | Count of generated pins |
| newsletterIncluded | boolean | Has this post been in a newsletter? |

### Site-Level Controls

| Control | Purpose |
|---|---|
| Featured homepage posts | Select which 4-5 posts appear on homepage |
| Featured order | Drag to reorder homepage layout |
| Category landing page intro | Edit intro copy for each pillar page |
| Destination hub intro | Edit intro copy for each destination page |
| Newsletter CTA text | Global newsletter signup copy |
| Destination-specific CTA text | Per-destination signup variant |
| Footer tagline | "No fluff, no filler." or custom |
| Social links | Instagram, Pinterest, TikTok URLs |
| Analytics ID | GA4 measurement ID |
| Pinterest verification | Domain verification code |

---

## Implementation Phases

### Phase 1: CLI + Read-Only Dashboards (Now → Month 2)

Build 6 dashboard pages as Astro pages that read from the SQLite DB (or JSON files generated by the CLI).

| Dashboard | Data Source | Complexity |
|---|---|---|
| Editorial | `content_calendar` table | Low |
| SEO | Content collection frontmatter scan | Low |
| Opportunities | `keywords` table + content count | Low |
| Distribution | `pins` table + content scan | Low |
| Monetization | Content body scan for affiliate tags | Medium |
| Performance | `performance_snapshots` table (manual input) | Low |

**CLI commands remain primary workflow**:
- `aileen plan` → generates plan, visible on Editorial Dashboard
- `aileen write` → generates draft, visible on Editorial Dashboard
- `aileen deploy` → deploys to Astro site
- `aileen publish` → builds + deploys to Cloudflare
- `aileen pins` → generates pins, visible on Distribution Dashboard
- `aileen audit` → scores posts, visible on SEO Dashboard
- `aileen newsletter` → drafts newsletter, visible on Distribution Dashboard
- `aileen voice-check` → NEW: scores voice, visible on Editorial Dashboard

### Phase 2: Interactive Dashboards (Month 3-4)

Add action buttons that trigger CLI commands via API routes:
- "Generate Brief" button calls `aileen plan` for a specific keyword
- "Generate Pins" button calls `aileen pins` for a specific post
- "Run Audit" button calls `aileen audit` for a specific post
- "Draft Newsletter" button calls `aileen newsletter`

### Phase 3: Full Editor Experience (Month 5-6)

Build the content editor, AI Assist sidebar, and image management:
- Markdown editor with preview
- AI rewrite/expand/FAQ generation
- Inline voice scoring
- Image upload and management
- Bulk operations

### Phase 4: Self-Service Publishing (Month 6+)

Aileen can do everything from the browser:
- Create new posts from briefs
- Edit with AI assistance
- Deploy and publish
- Manage featured content
- Update affiliate links
- Generate all distribution derivatives

---

## What Success Looks Like

1. **Month 1**: Aileen can see her content pipeline, keyword opportunities, and SEO health in dashboards. She still uses the CLI to create content but has visibility into the operation.

2. **Month 3**: Aileen can trigger content operations from dashboard buttons. She clicks "Generate Brief" → sees the brief → clicks "Write Draft" → reviews the draft → clicks "Deploy." No terminal needed.

3. **Month 6**: Aileen operates her entire content business from a browser. She publishes 3 posts/week, generates derivatives for all channels, monitors performance, and knows exactly what to write next — all without developer help.

4. **Ongoing**: The system gets smarter. Better voice scoring, better keyword suggestions, better refresh priorities. Each piece of content makes the next one easier to produce and more likely to compound.

---

## Comparison: WordPress vs. Aileen OS

| Capability | WordPress + Plugins | Aileen OS |
|---|---|---|
| Write a post | Gutenberg editor (clunky blocks) | Markdown editor + AI Assist + voice scoring |
| SEO optimization | Yoast sidebar (generic advice) | Keyword-specific scoring + internal link suggestions |
| Content planning | Separate spreadsheet | Integrated keyword bank + cluster gap analysis |
| Distribution | Log into 4 separate platforms | One dashboard + one-click derivative generation |
| Monetization | Manual affiliate link insertion | Structured product cards + click tracking |
| Performance | GA4 dashboard (generic) | Content-specific metrics + refresh recommendations |
| Publishing workflow | Draft → Review → Publish (no voice check) | Draft → Voice Score → SEO Check → Review → Deploy → Publish |
| Image management | WordPress media library (bloated) | Optimized upload + auto alt-text |
| What to write next | Gut feeling | Data-driven keyword + cluster recommendations |
| Time to publish | 2-3 hours per post | 30-45 minutes per post (AI first draft + voice-checked) |
