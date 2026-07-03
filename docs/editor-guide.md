# EVAN Magazine — Editor Guide

## How to Publish a New Post

### Option A: Using the Growth Engine (Recommended)

1. **Plan what to write**
   ```bash
   evan plan
   ```
   This generates a weekly 3-post plan based on keyword opportunities.

2. **Write a draft**
   ```bash
   evan write [post-id]
   ```
   AI Assist generates a voice-aligned draft. Review and edit the output in `output/drafts/`.

3. **Check voice alignment**
   ```bash
   evan voice-check output/drafts/your-post.md
   ```
   Aim for 75+ voice score before publishing.

4. **Deploy to site**
   ```bash
   evan deploy your-post-slug
   ```
   This copies the markdown to the Astro content directory.

5. **Build and publish**
   ```bash
   evan publish
   ```
   Builds the Astro site and deploys to Cloudflare.

6. **Generate derivatives**
   ```bash
   evan pins --id [post-id]     # Pinterest pins
   evan social "Post Title"     # Instagram captions
   evan newsletter              # Weekly newsletter
   ```

### Option B: Manual (Direct Markdown)

1. Create a new `.md` file in `src/content/posts/[pillar]/`
2. Add frontmatter (see schema below)
3. Write content in markdown
4. Run `npm run build` to verify
5. Run `npx wrangler deploy` to publish

## Frontmatter Reference

### Required Fields
```yaml
title: "Your Post Title"
metaDescription: "150-160 character description with keyword"
targetKeyword: "your target keyword"
pillar: "travel"          # travel | style | recipes | lifestyle
date: "2026-03-05"
image: "https://..."      # Hero image URL (1200x675 recommended)
imageAlt: "Descriptive alt text"
excerpt: "Short description for cards and social"
```

### Optional Fields
```yaml
contentType: "restaurant-guide"  # Defaults to "article"
updatedDate: "2026-04-01"        # Show "Updated" date
author: "Evan Ratner"           # Defaults to Evan
draft: true                      # Hide from site
featured: true                   # Show on homepage hero
featuredOrder: 1                 # Homepage position
cornerstone: true                # Pin to top of category pages + show in Popular Guides
destinations: ["miami"]          # Tag with destinations
affiliateDisclosure: true        # Show FTC disclosure
toc: true                        # Show table of contents
imageCaption: "The dining room"  # Caption below hero image
imageCredit: "Photo by Jane Doe" # Credit line below hero image
ogTitle: "Custom OG title"       # Override Open Graph title
ogDescription: "Custom OG desc"  # Override Open Graph description
canonicalOverride: "https://..."  # Override canonical URL
season: "summer"                 # Seasonal tag
newsletterCTAVariant: "destination"  # inline | bold | destination | shopping
relatedPosts:                    # Manual override (auto-resolved if empty)
  - "travel/boston-travel-guide"
  - "style/quiet-luxury-brands"
```

### Monetization Fields
```yaml
products:
  - name: "Eda Cashmere Sweater"
    brand: "Khaite"
    price: "$1,440"
    url: "https://affiliate-link"

bookingLinks:
  - name: "The Newbury Boston"
    platform: "Hotels.com"
    url: "https://booking-link"

reservationLinks:
  - name: "Makoto"
    platform: "Resy"
    url: "https://resy-link"
```

### FAQ Fields
```yaml
faq:
  - question: "What are the best restaurants in Miami?"
    answer: "Concise 2-3 sentence answer in Evan's voice."
```

## Managing Featured Content

Set `featured: true` and `featuredOrder: 1` in frontmatter to feature a post on the homepage hero. Only one post should have `featuredOrder: 1`.

## Managing Cornerstone Content

Set `cornerstone: true` on your most important evergreen guides. Cornerstone posts:
- Are pinned to the top of category pages
- Appear in the "Popular Guides" section on the homepage
- Have their FAQ items aggregated into pillar page FAQ sections

## Managing Destinations

Add destination slugs to the `destinations` array:
- `miami`, `palm-beach`, `boston`, `nyc`, `maine`, `aspen`, `nantucket`, `hamptons`, `italy`, `colorado`

Posts tagged with destinations appear on destination hub pages at `/magazine/destinations/[slug]/`.

## Updating Existing Posts

1. Edit the markdown file directly in `src/content/posts/`
2. Update the `updatedDate` field
3. Run `evan voice-check` on the updated file
4. Rebuild and deploy: `evan publish`

## Admin Dashboards

Visit `/magazine/admin/` to see:
- **Editorial**: Content pipeline, drafts, stale content alerts
- **SEO**: Missing meta, thin content, internal link gaps
- **Opportunities**: Keyword bank, cluster gaps, follow-up ideas
- **Distribution**: Pin status, newsletter status per post
- **Monetization**: Affiliate coverage, booking links, revenue readiness
- **Performance**: Session tracking, Mediavine progress

## Voice Rules

Every piece of content must sound like Evan. Key rules:
- Confident but not loud
- Specific (name dishes, rooms, pieces)
- Short sentences mixed with longer ones
- "Worth the reservation" language
- Never: "let's dive in", "comprehensive guide", "obsessed", "game-changer"
- Run `evan voice-check` before publishing

## Image Guidelines

- Hero images: 1200x675px minimum
- Use descriptive alt text (not "image" or "photo")
- WebP format preferred for performance
- Placeholder images use Unsplash — replace with real photography
