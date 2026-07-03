# Cafecito AI Magazine — Implementation Spec for Claude Code / Codex

## Objective
Transform `cafecito-ai.com/magazine` from a visually clean clone into a scalable editorial publishing system designed to grow high-quality search traffic, capture email subscribers, support affiliate monetization, and qualify for premium ad monetization.

This is not a redesign brief. It is a build specification.

The build must preserve the premium editorial feel of the EVAN brand while expanding the site into a true content platform with:
- crawlable topic architecture
- reusable content templates
- strong internal linking
- newsletter capture
- affiliate surfaces
- analytics instrumentation
- structured data
- editorial CMS workflows
- fast, indexable rendering on the existing Cloudflare stack

The live reference points are:
- Existing build: `https://cafecito-ai.com/magazine`
- Original/reference brand site: `https://evanlavin.com/`

The current Cloudflare version is materially thinner than the reference site in visible topic depth, archive structure, category surface area, and monetization paths. The new build must correct that.

---

# 0. Core Delivery Principle

This build is not just for internal use. It must be delivered as a clean, portable, client-ownable codebase that can be handed to Evan with minimal friction.

That changes the implementation standard.

The final product must be:
- easy to deploy
- easy to edit through a CMS
- easy to understand structurally
- easy to extend later
- not dependent on hidden internal tooling
- documented well enough that another developer can take over quickly

Any architecture choice that improves speed for the builder but makes ownership harder for the client should be rejected unless there is a compelling reason.

# 1. Product Definition

## 1.1 What this site should become
A premium editorial magazine focused on:
- restaurants worth booking
- destination travel guides
- hotel reviews and where-to-stay guides
- timeless style and shopping edits
- selected recipes with real utility

The site should feel like a hybrid of:
- elegant lifestyle magazine
- practical search-first editorial site
- affiliate-friendly recommendation engine
- newsletter-driven personal brand platform

## 1.2 Primary business goals
1. Increase qualified organic traffic.
2. Improve number of crawlable, rankable entry pages.
3. Capture email subscribers through editorial CTAs.
4. Add monetization surfaces before premium ad scale is reached.
5. Build reusable systems so new content compounds instead of existing as isolated posts.
6. Deliver a professional, handoff-ready codebase the client can own independently.

## 1.3 Non-goals
- Do not build a generic blog.
- Do not over-engineer authoring workflows beyond what a small editorial team needs.
- Do not rely on client-only rendering for critical content.
- Do not flood the site with low-effort AI filler.
- Do not create broad lifestyle sections with no clear search demand.

---

# 2. Technical Principles

## 2.1 Rendering and crawlability
The site must be indexable and performant.

Requirements:
- All primary content pages must be server-rendered or prerendered HTML.
- Metadata must be present in initial HTML.
- Canonicals must be deterministic.
- H1, intro copy, related content links, and category links must be present in HTML output.
- Do not hide core article text or navigation behind JavaScript hydration.
- XML sitemap must auto-generate.
- Robots.txt must be explicit and environment-safe.
- Pagination and archives must be crawlable.
- Tag archives should be noindexed unless intentionally curated.

Because the site runs on a Cloudflare-based stack, the implementation should prioritize static generation or edge rendering with stable HTML output rather than a thin SPA shell.

## 2.1.1 Client ownership requirements
The final codebase must be structured for handoff.

Requirements:
- all major configuration documented in README files
- clear environment variable documentation
- no mystery scripts
- no hardcoded internal credentials
- clear separation between content schema, UI components, utility functions, and SEO systems
- simple setup for local development
- one-command build and one-command deploy workflow where feasible
- comments only where useful; avoid noisy over-commenting
- use straightforward naming conventions
- avoid unnecessarily exotic abstractions
- include a deployment checklist
- include a CMS editor guide
- include a route map
- include a feature inventory

Recommended project sections:
- `app` or `pages` for routes
- `components` for reusable UI
- `lib` for utilities
- `schemas` or `cms` for content models
- `styles` if needed
- `public` for static assets
- `docs` for handoff documentation

## 2.2 CMS principle
The editorial team must be able to create and maintain:
- categories
- destinations
- restaurant roundups
- hotel reviews
- style guides
- recipes
- newsletter callouts
- affiliate blocks
- FAQ blocks
- related content links
- image alt text and captions
- SEO titles and meta descriptions

Preferred CMS characteristics:
- structured content model
- easy image management
- drafts and scheduled publishing
- custom fields for schema and affiliate blocks
- easy slug control
- author and update-date support

Any CMS is acceptable if it satisfies these constraints. If the current setup already has a CMS, extend it instead of replacing it unless replacement is clearly lower risk.

## 2.3 Performance targets
Build for strong Core Web Vitals and a premium editorial reading experience.

Must-have:
- responsive images
- lazy loading for below-the-fold media
- minimal layout shift
- local or optimized font strategy
- small JS bundle
- edge caching for public pages
- no blocking third-party bloat on article pages
- script loading strategy for analytics and embeds

---

# 3. Information Architecture

## 3.1 Primary sections
Replace the current shallow section model with a true editorial information architecture.

Top-level navigation:
- Restaurants
- Travel
- Hotels
- Style
- Recipes
- The Edit
- About

Optional utility items:
- Search
- Subscribe
- Shop / Favorites

## 3.2 Section intent
### Restaurants
Intent: search-led local and destination restaurant guides.
Page types:
- best restaurants in [city]
- best brunch in [city]
- best date night restaurants in [city]
- best italian restaurants in [city]
- neighborhood restaurant guides
- single restaurant editorial reviews if strategically useful

### Travel
Intent: destination guides and itineraries.
Page types:
- travel guide for [destination]
- weekend itinerary in [destination]
- 2-day / 3-day / 5-day itinerary
- things to do in [destination]
- seasonal guide pages

### Hotels
Intent: where-to-stay roundups and individual hotel review pages.
Page types:
- where to stay in [city]
- best luxury hotels in [city]
- best boutique hotels in [city]
- hotel review: [property name]

### Style
Intent: search-friendly but editorial shopping and outfit content.
Page types:
- what to wear in [destination] in [season]
- quiet luxury brands
- capsule wardrobe guides
- dinner outfit guides
- style icon breakdowns
- travel outfit edits

### Recipes
Intent: narrow, high-quality, recipe-markup-enabled utility content.
Page types:
- signature recipes
- practical family recipes
- repeatable kitchen staples

### The Edit
Intent: brand/editorial/curation layer.
Page types:
- product edits
- favorites lists
- seasonal shopping roundups
- newsletter archive or curation page

## 3.3 Destinations and taxonomy
Support destination-driven clustering through a first-class taxonomy.

Create a `destination` taxonomy separate from primary category.
Examples:
- Miami
- Palm Beach
- New York
- Boston
- Maine
- Aspen
- Colorado
- Nantucket
- Hamptons
- Italy

Each destination page must have:
- intro copy
- featured guides
- restaurants in that destination
- hotels in that destination
- style guides relevant to that destination
- newsletter CTA

This allows one destination hub to aggregate cross-category content.

## 3.4 Category pages
Each primary category page must be a real landing page, not just a raw archive.

Requirements:
- short editorial intro
- featured hero story
- article grid
- filters by destination or subtype where useful
- permanent internal links to cornerstone pages
- newsletter CTA
- optional FAQ for major landing pages if appropriate

---

# 4. URL Structure

Use clean, stable URLs.

Recommended patterns:
- `/magazine/restaurants/`
- `/magazine/travel/`
- `/magazine/hotels/`
- `/magazine/style/`
- `/magazine/recipes/`
- `/magazine/destinations/miami/`
- `/magazine/destinations/new-york/`
- `/magazine/best-restaurants-in-miami/`
- `/magazine/boston-travel-guide/`
- `/magazine/what-to-wear-in-aspen-this-summer/`
- `/magazine/the-best-sourdough-bread-recipe-i-make-every-time/`

Rules:
- keep slugs human-readable
- avoid date-based URLs
- avoid nested category/date cruft
- preserve any existing URLs already live where possible
- 301 redirect all changed slugs

---

# 5. Content Models

Implement structured content models in the CMS.

## 5.1 Article
Fields:
- title
- slug
- excerpt / dek
- category
- subcategory
- destination tags
- cover image
- body
- author
- publish date
- updated date
- SEO title
- meta description
- open graph title
- open graph description
- canonical URL override
- featured flag
- cornerstone flag
- affiliate disclosure toggle
- newsletter CTA variant
- FAQ section
- related articles manual override
- image gallery
- citations / source notes field for editorial use only if desired

## 5.2 Restaurant Guide
Same as Article plus:
- city
- neighborhood
- restaurant list items (repeatable block)
  - restaurant name
  - short description
  - why it stands out
  - address
  - reservation URL
  - cuisine
  - price range
  - map coordinates optional
- guide summary block
- quick picks block
- FAQ

## 5.3 Hotel Review / Stay Guide
Fields:
- city
- property name
- property type
- booking URL
- price tier
- good for
- standout features
- review sections
- room notes
- service notes
- location notes
- alternatives nearby
- FAQ

## 5.4 Style Guide
Fields:
- style theme
- season
- destination relevance
- product blocks
  - item name
  - brand
  - affiliate URL
  - price
  - category
  - image
- outfit sections
- shopping tips
- FAQ

## 5.5 Recipe
Fields:
- recipe title
- slug
- excerpt
- prep time
- cook time
- total time
- servings
- ingredients
- instructions
- notes
- image gallery
- FAQ
- nutrition optional
- recipe schema fields

## 5.6 Newsletter CTA block
Reusable component with variants:
- inline subtle
- bold mid-article
- footer signup
- destination-specific
- shopping-specific

---

# 6. Page Templates

## 6.1 Homepage
The homepage should evolve from a thin magazine grid to a strategic editorial front door.

Required sections:
1. Hero area
   - one major featured story
   - one sentence positioning copy
   - strong image
2. Signature clusters
   - restaurants
   - travel
   - hotels
   - style
3. Destination rows
   - Miami
   - Palm Beach
   - NYC
   - New England / Boston / Maine
   - Aspen / Colorado
4. Latest stories
5. Editor’s picks / The Edit
6. Newsletter signup
7. Popular guides
8. Footer with category and destination links

Homepage must drive users deeper into evergreen clusters, not just surface the newest posts.

## 6.2 Standard article template
Required modules in order:
- breadcrumb
- category / destination label
- H1
- dek / intro summary
- author + publish/update metadata
- hero image
- optional trust / methodology note
- body content
- inline newsletter CTA
- FAQ if applicable
- related reads from same cluster
- footer subscribe section

## 6.3 Roundup template
Use for restaurant, hotel, shopping, and destination guide pages.

Required modules:
- H1
- intent-matching intro
- quick picks summary box
- jump links / table of contents
- primary content sections
- map or location context when useful
- FAQ
- related guides
- CTA to newsletter or edit

## 6.4 Destination hub template
Required modules:
- destination title
- editorial intro
- hero image
- featured guide
- where to eat section
- where to stay section
- what to wear / style section
- itinerary guides
- related destinations
- newsletter CTA

## 6.5 Search results template
Requirements:
- fast and usable
- article cards with image, title, excerpt, category, destination
- empty-state guidance
- allow search by destination, restaurant, hotel, style terms

## 6.6 Newsletter landing page
Create a dedicated subscribe page with:
- value proposition
- social proof placeholder
- sample topics
- signup form
- links to best starter guides

---

# 7. Internal Linking System

This is a core part of the build.

## 7.1 Rules
Every article must link to:
- at least 2 related articles in the same category
- at least 1 destination page if destination-specific
- at least 1 adjacent-cluster page where relevant

Examples:
- `best restaurants in miami` links to `where to stay in miami`, `miami destination hub`, and `what to wear in miami`
- `boston travel guide` links to `where to stay in boston`, `best restaurants in boston`, and `maine itinerary`

## 7.2 Related content engine
Implement automatic related content logic with manual override.

Default ranking logic:
1. same destination + same category
2. same destination + adjacent category
3. same category + high-priority cornerstone
4. editor override

## 7.3 Persistent cluster modules
Add fixed modules on eligible pages:
- “More in Miami”
- “More in Palm Beach”
- “Where to eat next”
- “What to wear there”
- “Where to stay”

---

# 8. SEO and Metadata Requirements

## 8.1 On-page SEO
Every content type needs support for:
- SEO title
- meta description
- canonical
- OG tags
- Twitter tags
- index/noindex control
- custom excerpt/dek

## 8.2 Structured data
Implement JSON-LD where appropriate.

Required:
- `Organization`
- `WebSite`
- `BreadcrumbList`
- `Article`
- `Recipe` for recipe pages
- `FAQPage` only where content genuinely includes FAQs and complies with current Google guidance

Optional/conditional:
- `Review` only when appropriate and policy-compliant
- `ItemList` for curated roundups if helpful

## 8.3 XML sitemap
Generate:
- main sitemap index
- posts sitemap
- pages sitemap
- destinations sitemap
- categories sitemap if indexable
- images sitemap optional

## 8.4 Robots
Explicitly allow crawl of public content and block only admin, preview, and system paths.

## 8.5 Canonicals and duplicates
- prevent duplicate archive permutations
- canonical paginated pages correctly
- noindex low-value tag pages unless promoted intentionally

## 8.6 Image SEO
Every image entry should support:
- alt text
- caption
- credit/source if needed
- width/height
- responsive renditions
- descriptive filenames in build pipeline if feasible

---

# 9. Monetization Surfaces

Do not wait for full-scale display monetization to begin monetizing.

## 9.1 Affiliate support
Implement reusable commerce components:
- product card
- product grid
- “shop the edit” row
- booking button block
- reservation button block
- affiliate disclosure block

Each component should support tracking parameters.

## 9.2 Monetizable page types
Highest priority:
- where to stay guides
- hotel roundups
- style shopping guides
- product edits
- destination packing lists

Secondary:
- restaurant pages with reservation links
- recipes with product/tool recommendations only if authentic

## 9.3 Ad readiness
Design templates with future display monetization in mind:
- content width and paragraph rhythm should accommodate in-content ads later
- avoid layout patterns that will break when ad units are inserted
- ensure body content is sufficiently substantial on key pages

---

# 10. Newsletter and Audience Capture

Email is part of the product, not a footer afterthought.

## 10.1 Signup surfaces
Required placements:
- homepage featured signup
- mid-article CTA
- end-of-article CTA
- destination hub CTA
- dedicated subscribe page
- exit-intent or modal optional if tasteful and performance-safe

## 10.2 Newsletter positioning
Use brand language similar to:
- what’s worth booking
- what’s worth packing
- what’s worth your time

## 10.3 Form integration
Connect signup forms to the existing email platform or implement one if missing.
Track:
- form impressions
- submit success
- source page
- CTA variant

---

# 11. Analytics and Instrumentation

## 11.1 Baseline analytics
Install or verify:
- GA4
- Google Search Console
- Bing Webmaster Tools optional
- Meta / Pinterest tagging only if actively used

## 11.2 Custom events
Track:
- newsletter signup start
- newsletter signup complete
- outbound affiliate click
- reservation click
- booking click
- TOC interaction
- related article click
- search usage
- destination filter usage
- scroll depth on article pages

## 11.3 Content reporting layer
Prepare the site so reporting can answer:
- which destinations attract the most entrances
- which category templates perform best
- which posts drive subscriber signups
- which outbound links drive revenue actions
- which related modules actually get clicked

---

# 12. Editorial System Requirements

## 12.1 Reusable editorial templates in CMS
Create starter templates for:
- best restaurants in [city]
- travel guide for [destination]
- where to stay in [city]
- what to wear in [destination]
- recipe post
- product edit

## 12.2 Mandatory fields before publish
Require validation for:
- title
- slug
- excerpt
- category
- featured image
- meta title
- meta description
- author
- alt text on hero image

## 12.3 Update workflow
Support visible `updated at` dates and easy refreshing of evergreen guides.

## 12.4 Editorial quality guardrails
Add publishing checklist to CMS admin docs:
- Does it have a clear intent?
- Is it part of a cluster?
- Does it link to related pages?
- Does it include original perspective or firsthand experience?
- Does it include at least one conversion path?

---

# 13. Content Strategy the Build Must Support

The platform must support a cluster-based publishing model.

## 13.1 Core clusters
Initial cluster priorities:
- Miami
- Palm Beach
- New York
- Boston / New England / Maine
- Aspen / Colorado

## 13.2 Content archetypes
The CMS and templates must make these easy to create:
- Best restaurants in [city]
- Best brunch in [city]
- Best date night restaurants in [city]
- Travel guide to [destination]
- 2 days in [city]
- Where to stay in [city]
- Best luxury hotels in [city]
- What to wear in [destination] in [season]
- Quiet luxury / capsule / brand edit pages
- Core recipe pages

## 13.3 Homepage and category surfacing logic
Must support pinning cornerstone content so the strongest evergreen pages remain visible even after newer posts go live.

---

# 14. Design Direction

Retain premium editorial aesthetics, but make the UX more functional.

## 14.1 Tone
- elegant
- warm
- expensive without being flashy
- clean but not sterile
- editorial, not corporate

## 14.2 Functional design goals
- easier scanning
- stronger hierarchy
- more destinations and clusters exposed above the fold
- better article depth cues
- stronger image presence
- newsletter CTAs that feel native to editorial design

## 14.3 UX details
- sticky desktop nav
- compact mobile nav
- breadcrumbs on internal pages
- readable typography
- comfortable line length
- visible category and destination labels
- tasteful hover states
- polished card system

---

# 15. Feature Set the New Version Should Add

The goal is not to recreate the existing site exactly. The goal is to deliver a better version with more useful features while preserving editorial tone.

## 15.1 Must-add features
The new build should include the following feature improvements over the current clone:
- richer homepage with cluster surfacing
- destination hub pages
- category landing pages with editorial intros
- better related content system
- integrated site search
- stronger newsletter capture system
- affiliate/product modules
- booking/reservation CTA blocks
- reusable roundup templates
- FAQ support
- editor-controlled featured content
- improved metadata controls
- automatic sitemap generation
- analytics event instrumentation
- better mobile navigation
- better article scanning with table of contents on long guides
- visible updated dates for evergreen content

## 15.2 High-value optional features
If stack complexity remains manageable, also include:
- author page
- favorites page / The Edit page
- destination-based filtering on archives
- trending or popular guides module
- CMS-controlled promo banners
- seasonal featured collections

## 15.3 Feature implementation rule
Do not add features that create heavy ongoing maintenance unless they clearly improve business value.

# 16. Migration and Preservation

## 15.1 Preserve existing value
Audit current live URLs and preserve them unless change is necessary.
If changing any existing path:
- implement 301 redirects
- update internal links
- update sitemap
- avoid orphaning content

## 15.2 Content seeding
If only a small number of articles exist in the current build, seed the new architecture with all existing content mapped into proper categories and destinations.

## 15.3 Do not launch empty architecture
If a category or destination hub is exposed in navigation, it should contain meaningful starter content and intro copy.

---

# 17. Handoff Package Requirements

The codebase is not complete until it is handoff-ready.

## 17.1 Documentation
Include:
- root README with setup, run, build, deploy, and project overview
- `.env.example` with every required variable documented
- CMS setup guide
- content editor guide for non-technical users
- deployment guide
- route map
- component inventory
- analytics event map
- redirect map if applicable

## 17.2 Codebase quality
Requirements:
- remove dead code
- remove placeholder/demo content not intended for production
- no broken routes
- no TODO comments unless they are intentional and documented
- consistent naming and folder structure
- no secrets committed
- no internal business-specific dependencies unless intended for client ownership

## 17.3 Client-operable admin experience
The client should be able to:
- create a new article
- create a new roundup
- create a destination hub entry
- edit SEO fields
- update newsletter CTA text
- update affiliate/product links
- feature or unfeature homepage content
- upload and replace images
without requiring a developer for normal editorial operations.

## 17.4 Deliverables for handoff
The final handoff package should contain:
- production-ready repository
- documentation folder
- setup instructions
- CMS/editor guide
- deployment notes
- known issues list if any remain
- post-launch recommendations list

# 18. Acceptance Criteria

The project is complete only when all of the following are true:

## 16.1 Structural
- primary nav reflects new architecture
- category pages are real landing pages
- destination taxonomy exists and is visible
- article, roundup, destination, and recipe templates exist
- homepage surfaces evergreen clusters, not just latest posts

## 16.2 SEO
- metadata outputs correctly on all templates
- XML sitemap exists and updates automatically
- robots.txt is valid
- canonicals are present
- structured data validates for supported templates
- all critical content is available in server-rendered HTML

## 16.3 Editorial
- editors can create all required content types from CMS
- required publish fields are enforced
- related content modules work
- newsletter CTA variants can be assigned per article

## 16.4 Analytics
- GA4 is configured
- key events are firing
- affiliate and booking clicks are measurable
- newsletter signups are measurable

## 16.5 UX and performance
- pages are responsive
- images are optimized
- layout shift is controlled
- mobile article pages are fast and readable

---

# 19. Implementation Task Breakdown for the Coding Agent

## Phase A — Audit existing codebase
1. Inspect framework, routing, data fetching, CMS integration, and current deployment method.
2. Identify current content source and schema.
3. Map all current URLs.
4. Document current metadata, sitemap, robots, and structured data behavior.
5. Identify whether content is SSR, SSG, ISR, or CSR.
6. Confirm where newsletter forms and analytics currently live.

Output required:
- concise architecture audit
- risks list
- recommended implementation approach using current stack if viable

## Phase B — Rebuild information architecture
1. Implement new nav.
2. Create category hub routes.
3. Create destination taxonomy and hub routes.
4. Add search route if missing.
5. Add subscribe page.

## Phase C — Build CMS schema
1. Define content models.
2. Add repeatable blocks for roundups, FAQs, CTA blocks, and affiliate sections.
3. Add validation rules.
4. Migrate existing content into the new schema.

## Phase D — Build templates
1. Homepage
2. Category page
3. Destination hub
4. Standard article
5. Roundup page
6. Recipe page
7. Search page
8. Subscribe page

## Phase E — SEO systems
1. Metadata utilities
2. Canonical logic
3. Open Graph generation
4. JSON-LD components
5. Sitemap generation
6. Robots generation
7. Breadcrumb component

## Phase F — Internal linking and related content
1. Automatic related-content resolver
2. Manual override support
3. Destination module components
4. Cluster modules for article templates

## Phase G — Monetization and CTAs
1. Newsletter blocks
2. Affiliate product cards
3. Booking/reservation CTAs
4. Affiliate disclosure component

## Phase H — Analytics
1. GA4 integration verification
2. Event instrumentation
3. Utility wrapper for outbound click tracking
4. Debug mode for QA

## Phase I — QA and launch
1. Verify routing and redirects
2. Validate metadata and schema
3. Test CMS authoring flow
4. Test performance on mobile and desktop
5. Validate sitemap and robots
6. Confirm all core templates are indexable

---

# 20. Prompt the Coding Agent Should Follow

Use the following operating instructions:

You are not redesigning a blog. You are rebuilding a premium editorial publishing system optimized for search growth, subscription capture, and affiliate monetization. Preserve the EVAN visual tone, but upgrade the site architecture, CMS schema, content templates, SEO infrastructure, and analytics so the site becomes a true traffic-compounding magazine.

Priorities in order:
1. crawlable architecture
2. reusable content types
3. internal linking
4. metadata and structured data
5. newsletter and affiliate conversion surfaces
6. polished premium UX
7. performance and maintainability

Do not create thin pages. Do not rely on client-only rendering for article content. Do not ship generic archives without intro copy and purposeful internal links. Do not treat content as flat blog posts; everything should belong to a cluster or destination system.

As you implement, produce:
- updated route map
- content schema definitions
- reusable UI component list
- metadata strategy
- migration notes
- QA checklist

When you make assumptions, prefer simple, durable architecture over clever complexity.

---

# 21. Optional Stretch Features

Only after the core system is complete:
- author page with editorial bio and trust signals
- saved favorites functionality
- map embeds for restaurant and hotel guides
- popular posts module powered by analytics
- editorially curated search landing pages
- image-heavy Pinterest landing pages
- Evan’s favorites / shop page

---

# 21A. Live Audit Addendum — Current Gaps Observed on the Shipped Site

Based on direct review of the live site and admin surfaces, the implementation is materially incomplete relative to the target spec.

## Front-end gaps observed
- homepage still exposes only a shallow content footprint with fo([]()) surfaced posts
- current top navigation does not yet reflect the stronger target architecture of Restaurants / Travel / Hotels / Style / Recipes / The Edit
- destination experience exists, but destination pages are still thin and only lightly populated
- category pages appear unstable or incomplete in live routing checks
- article discovery and internal linking remain weak versus the reference site
- the homepage and destination pages still feel more like a content shell than a full editorial magazine system
- the current experience does not yet communicate the upscale, image-led, luxury editorial feel required for the brand

## Critical routing/content issue observed
The homepage article links, as currently resolved in the live environment during review, pointed to non-`/magazine` article paths and returned 404s. This must be treated as a release-blocking issue and fully audited across all article cards, related content modules, and destination links.

## Admin/dashboard gaps observed
- dashboards exist, but many are still reporting layers rather than operational tools
- editorial dashboard shows only a very small content base and no real drafting pipeline
- SEO dashboard reports strong health while also showing zero posts with SEO scores, indicating placeholder or incomplete scoring logic
- performance dashboard still relies on manual updates for session tracking and includes placeholder-style readiness logic
- distribution dashboard is effectively empty operationally, with zero pins, zero newsletter distribution, and zero fully distributed posts
- monetization dashboard exists, but monetization depth is still too light to support meaningful revenue
- dashboard data quality and live data wiring need to be audited before these surfaces can be considered production-grade

## Highest-priority improvements now
1. Fix route generation and verify every article/card link end-to-end.
2. Rebuild navigation to reflect the full target architecture.
3. Strengthen homepage into a true upscale editorial front with stronger section hierarchy, destination surfacing, and image-led presentation.
4. Turn destination pages into real hubs with restaurants, hotels, style, itineraries, and newsletter modules.
5. Add stable category landing pages and verify all category routes.
6. Replace placeholder dashboard logic with live, trustworthy content and analytics-driven data.
7. Expand content inventory materially so the dashboards and front-end surfaces have enough depth to feel real.
8. Upgrade design language to feel like a premium magazine rather than a thin lifestyle clone.

## Product judgment
The current build appears to be roughly 35–45% complete: enough structure exists to validate direction, but not enough depth, polish, operational integrity, or content density to be considered a finished editorial product.

# 22. Final Deliverables the Agent Should Produce

The coding agent’s final output should include:
1. updated codebase implementing the new architecture
2. migration summary
3. list of all routes and templates
4. CMS schema documentation
5. SEO checklist with what was implemented
6. analytics event map
7. redirect map if any slugs changed
8. short editor guide explaining how to create each content type
9. root README and `.env.example`
10. deployment guide
11. feature inventory showing what is improved versus the current site
12. known issues and recommended next enhancements

This project is successful when Cafecito AI Magazine is no longer just a clone of the original site’s homepage style, but a stronger publishing engine with real editorial infrastructure and compounding traffic potential.

