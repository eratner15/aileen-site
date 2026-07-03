You are a senior editorial platform architect, growth product builder, SEO systems engineer, AI workflow designer, and full-stack engineer.

Your mission is to transform `cafecito-ai.com/magazine` into a true editorial flywheel built around Evan’s voice, taste, and publishing patterns.

This is not a blog redesign.
This is not a homepage clone.
This is not a generic AI-content engine.

This is a rebuild into a premium, client-ownable media operating system that compounds over time through:
1. voice-consistent publishing
2. search-driven clusters
3. email and social distribution
4. monetization modules
5. content refresh loops
6. editorial dashboards
7. AI-assisted content workflows

The output must be a stronger product than the original WordPress experience and a stronger growth engine than the current clone.

==================================================
TOP-LEVEL PRODUCT VISION
==================================================

Build “Evan OS”:

A premium editorial publishing system that codifies Evan’s voice and turns it into a scalable flywheel.

The flywheel should work like this:

1. Evan publishes or generates a high-quality voice-aligned guide
2. the guide is automatically placed into the right cluster, destination, and category
3. the system recommends related links, FAQs, CTAs, and follow-up content
4. the content ranks organically and also becomes distributable via email, social, and Pinterest
5. the page captures newsletter subscribers and monetization clicks
6. dashboards identify what is working, what is stale, and what to publish next
7. AI assist uses her prior writing to accelerate new content creation in her voice
8. the system compounds and gets smarter as more content is added

You are building that flywheel.

==================================================
CORE EXECUTION PRINCIPLE
==================================================

Every feature must strengthen at least one of these:
- voice consistency
- publishing speed
- content quality
- organic traffic
- distribution
- monetization
- editorial usability
- client ownership

If something is clever but does not improve the flywheel, deprioritize it.

VISUAL / BRAND DIRECTION

This platform must feel like an upscale magazine.

Use the design language of a premium editorial publication such as Vogue as inspiration for:
- hierarchy
- typography
- image treatment
- whitespace
- section pacing
- homepage composition
- editorial confidence

Do not make it feel like a generic content site, affiliate blog, or SEO publisher.
It should feel image-led, luxurious, curated, and fashion-editorial, while still being highly usable and conversion-capable.

Key visual principles:
- bold editorial typography
- premium serif/sans pairing
- generous whitespace
- large-format imagery
- polished section fronts
- elegant grid systems
- restrained color palette
- subtle motion only where it adds polish
- curated commerce modules that feel like magazine edits
- mobile experience that still feels premium, not compressed or utilitarian

==================================================
PART 1 — FIRST BUILD EVAN’S VOICE ENGINE
==================================================

You must treat Evan’s existing published articles as source material for a reusable voice system.

Your first task is to extract and codify her voice from content on `evanlavin.com` and any migrated content available in the repo or CMS.

Build a structured “Voice Engine” with the following components:

A. Voice Profile
Create a formal voice system capturing:
- tone
- rhythm
- sentence length tendencies
- vocabulary preferences
- recommendation style
- how she expresses taste
- how she signals authority
- how she opens posts
- how she frames “worth it”
- how she discusses repetition / return behavior
- how she balances elegance and practicality
- what she avoids saying
- what sounds too generic, too SEO-ish, too salesy, or too trend-chasing

B. Editorial Positioning Model
Codify her editorial identity:
- curated, not exhaustive
- selective, not maximalist
- confident, not loud
- practical luxury, not flashy luxury
- return-oriented, not novelty-hunting
- tasteful utility, not content farm energy

C. Content Heuristics
Teach the system how she makes recommendations:
- what makes a restaurant “worth it”
- what makes a hotel rebookable
- what makes a style item timeless
- what makes a destination guide feel useful but elevated
- when she is writing from preference vs trend
- how she distinguishes “good” from “go back again and again”

D. Voice Constraints
Add explicit anti-patterns:
- do not sound like generic SEO copy
- do not sound like a hype-driven influencer
- do not sound like an affiliate spam site
- do not sound like a travel aggregator
- do not sound like a mass-market shopping blog
- do not overuse adjectives
- do not fake first-hand experience
- do not become robotic or template-stiff

E. Voice Assets
Implement these as reusable system artifacts:
- `VOICE_PROFILE.md`
- `VOICE_RULES.json` or equivalent structured config
- prompt templates for AI assist
- tone validation heuristics
- editorial checklist for voice alignment

Do not keep this as vague prose only.
Turn it into a system the product can use.

==================================================
PART 2 — BUILD THE AI-ASSISTED EDITORIAL SYSTEM
==================================================

Build an AI-assisted editorial workflow that helps create better content faster without generating junk.

Create an “AI Assist” layer inside the admin/editor experience.

The AI Assist must support:
1. generate article briefs
2. generate SEO title options
3. generate meta description options
4. generate outlines
5. generate FAQ suggestions
6. generate internal linking suggestions from existing site content
7. generate destination/category suggestions
8. generate newsletter CTA variants
9. generate Instagram/TikTok caption ideas
10. generate Pinterest title + description ideas
11. generate “follow-up pages to publish next” suggestions
12. rewrite content blocks for stronger Evan-style alignment
13. generate commerce blurbs for products, hotels, destinations, or restaurants
14. generate “top picks” summary boxes
15. generate content refresh suggestions for stale pages

Important rules:
- AI output must default to draft state
- no auto-publishing
- editor review required
- output should be editable and modular
- AI calls should be centralized and documented
- do not bury prompt logic inside scattered components

Create a clean service layer for AI operations:
- prompt templates
- voice conditioning
- content-type-specific prompt wrappers
- result formatting
- moderation/guardrails if needed
- config for model/provider

==================================================
PART 3 — BUILD THE CONTENT SYSTEM AS REUSABLE PRODUCTS
==================================================

Do not treat articles as generic posts.
Build structured content templates that turn Evan’s writing style into repeatable editorial products.

Required content types:
- Article
- Restaurant Guide
- Travel Guide
- Hotel Review / Where to Stay Guide
- Style Guide
- Shopping Edit / The Edit
- Recipe
- Destination Hub
- Newsletter CTA Block
- FAQ Block
- Product / Affiliate Block

For each content type, support:
- title
- slug
- excerpt/dek
- body
- author
- featured image
- category
- destination
- SEO fields
- schema type
- CTA variants
- FAQ
- internal linking controls
- featured/homepage controls
- updated date
- affiliate/booking fields if relevant

For each content type, build a distinct page template optimized for:
- readability
- scanability
- search intent
- internal linking
- monetization
- distribution

==================================================
PART 4 — BUILD THE FLYWHEEL LOGIC
==================================================

Design the system so every piece of content feeds the next one.

Implement these flywheel behaviors:

A. Cluster Assignment
When content is created, the system should associate it with:
- a primary category
- one or more destinations
- a cluster theme
- adjacent related content opportunities

B. Follow-up Suggestions
After a page is drafted or published, the system should suggest:
- related cluster pages to create next
- missing supporting content
- crosslinks that should be added
- CTA opportunities
- Pinterest/social/email derivatives

C. Refresh Loop
The system should flag:
- evergreen content that has gone stale
- pages missing updated date
- pages with weak internal linking
- pages with missing monetization blocks
- pages missing social derivative assets
- pages missing FAQs or summary blocks

D. Distribution Loop
Every important article should have optional derivative assets:
- newsletter subject line options
- newsletter summary block
- Instagram caption
- TikTok caption/script seed
- Pinterest title and description
- “save this guide” microcopy
- optional featured collection placement

E. Monetization Loop
For monetizable content, the system should suggest:
- hotel booking links
- restaurant reservation links
- affiliate cards
- product blocks
- “The Edit” linkage
- destination-specific commerce opportunities

==================================================
PART 5 — BUILD THE ORGANIC + INORGANIC GROWTH ENGINE
==================================================

This platform must support both organic and inorganic growth.

==================================================
5A — ORGANIC ENGINE
==================================================

Build the site for high-quality organic compounding.

Implement:
- destination hub pages
- category landing pages
- crawlable archives with intro copy
- related content modules
- structured data
- strong metadata support
- descriptive slugs
- XML sitemap
- robots.txt
- canonical handling
- breadcrumbs
- image alt text management
- TOC for long guides
- updated dates
- content quality/admin checks

Build a content-opportunity framework around clusters such as:
- Miami
- Palm Beach
- NYC
- Boston / New England / Maine
- Aspen / Colorado
- quiet luxury
- destination outfits
- hotel and restaurant roundups

The system should help editors identify cluster gaps and expansion opportunities.

==================================================
5B — INORGANIC ENGINE
==================================================

Build distribution and audience capture features that do not depend on Google alone.

Support:
- newsletter signup modules
- destination-specific signup variants
- “The Evan Edit” newsletter positioning
- social derivative generation
- Pinterest metadata generation
- homepage and category merchandising
- featured collections
- optional campaign/promo banner system
- saved-guide style UX on destination and restaurant pages
- “share / save / send” oriented microcopy where appropriate

Build for traffic from:
- email
- Instagram
- TikTok
- Pinterest
- referrals / partnerships
- direct repeat traffic
- saved destination guides

==================================================
PART 6 — BUILD THE DASHBOARDS THAT POWER THE FLYWHEEL
==================================================

WordPress gave her a publishing UI, but this build should give her a better operating system.

Implement these admin/editor dashboards:

1. Editorial Dashboard
Show:
- drafts
- recently published content
- scheduled content
- featured homepage content
- content by category
- content by destination
- stale pages
- content missing hero image
- content missing updated date
- content missing FAQ or CTA
- most recently refreshed pages

2. SEO Dashboard
Show:
- missing SEO title/meta
- missing OG image
- missing alt text
- noindex pages
- pages with weak/internal link gaps
- pages missing category/destination
- pages missing schema type
- pages with weak or duplicate titles where feasible
- orphaned pages where feasible

3. Content Opportunities Dashboard
Show:
- suggested next articles by destination/category
- cluster gaps
- follow-up page opportunities
- AI-generated topic ideas
- refresh opportunities
- pages that should be expanded into roundups or hubs

4. Distribution Dashboard
Show:
- pages missing newsletter derivative
- pages missing Pinterest metadata
- pages missing social derivative copy
- featured collection usage
- signup CTA placements by template

5. Monetization Dashboard
Show:
- pages with affiliate blocks
- pages with booking links
- pages with reservation links
- pages missing monetization modules where relevant
- monetizable content types
- outbound click events if available

6. Performance Dashboard
If analytics integration is feasible, show:
- top pages
- top destinations
- top categories
- pages driving signups
- pages driving outbound clicks
- search usage
- related-post click performance

If live analytics APIs are too heavy, create a documented adapter layer and a clear fallback/manual mode.
Do not fake data without labeling it.

==================================================
PART 7 — BUILD THE CLIENT-OWNABLE ADMIN EXPERIENCE
==================================================

The platform must be handoff-ready and easy for Evan to operate.

She must be able to:
- publish new content
- use AI Assist
- manage featured content
- edit SEO fields
- update CTAs
- update affiliate links
- manage destination hubs
- manage category landing pages
- upload images
- update existing evergreen posts
- identify what to publish next
- see what needs fixing

This experience must be simpler and more useful than a messy plugin-heavy WordPress setup.

==================================================
PART 8 — BUILD THE MONETIZATION STACK
==================================================

Do not optimize only for display ads.

Build a broader monetization system that supports:
- future ad readiness
- affiliate product blocks
- shopping edits
- hotel booking CTAs
- restaurant reservation links
- commerce click tracking
- curated product collections
- destination packing/product guides
- newsletter sponsorship readiness
- potential premium guide products later

Templates should leave room for future ads without ruining UX.

==================================================
PART 9 — IMPLEMENTATION AND ARCHITECTURE RULES
==================================================

Technical rules:
- preserve the existing stack if it is viable
- if changing the stack, justify clearly
- all primary content must be server-rendered or prerendered HTML
- metadata must render correctly in initial HTML
- avoid fragile client-only article rendering
- centralize SEO utilities
- centralize AI service logic
- centralize analytics event tracking
- use clean folder structure
- use clear naming
- no hardcoded secrets
- include `.env.example`
- include docs
- remove dead code
- keep abstractions practical

Recommended architectural modules:
- routes/templates
- CMS schemas/models
- AI service layer
- voice engine assets
- SEO utilities
- analytics utilities
- dashboard/admin views
- monetization components
- docs/handoff materials

==================================================
PART 10 — REQUIRED DELIVERABLES
==================================================

As you work, deliver in phases.

For each phase, provide:
1. findings
2. changes made
3. key files added/updated
4. why this improves the flywheel
5. remaining tasks

Final deliverables must include:
- production-ready codebase
- architecture audit
- route map
- CMS schema definitions
- page template inventory
- reusable component inventory
- Voice Engine assets
- AI Assist implementation summary
- dashboard inventory
- SEO implementation summary
- monetization feature list
- analytics event map
- migration notes
- redirect map if needed
- root README
- `.env.example`
- deployment guide
- editor guide
- known issues
- list of recommended next enhancements

==================================================
PART 11 — EXECUTION ORDER
==================================================

Work in this order:

PHASE A — audit current repo and architecture
PHASE B — extract and codify Evan Voice Engine
PHASE C — design content models and taxonomy
PHASE D — build page templates and architecture
PHASE E — build AI Assist layer
PHASE F — build dashboards
PHASE G — build SEO systems
PHASE H — build monetization and distribution modules
PHASE I — wire analytics and events
PHASE J — QA, docs, handoff polish

Do not skip the Voice Engine step.
It is central to the product.

==================================================
PART 12 — FINAL STANDARD
==================================================

The result should feel like this:

Not a clone.
Not a blog.
Not an AI content machine.
Not a WordPress downgrade.

It should feel like a premium editorial operating system trained on Evan’s taste and built to compound traffic, revenue, and usefulness over time.

Start with:
1. auditing the current codebase
2. extracting the voice system
3. proposing the flywheel architecture before implementation