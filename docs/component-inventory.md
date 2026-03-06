# Component Inventory

All components are in `src/components/`.

## Content Components

| Component | File | Props | Purpose |
|-----------|------|-------|---------|
| `PostCard` | `PostCard.astro` | `title`, `href`, `pillar`, `excerpt`, `date`, `image` | Card for post grids |
| `PostGrid` | `PostGrid.astro` | `posts` (array) | Grid of PostCards with empty state |
| `Breadcrumbs` | `Breadcrumbs.astro` | `pillar`, `title` | Breadcrumb navigation + BreadcrumbList JSON-LD |
| `TableOfContents` | `TableOfContents.astro` | `headings` (from Astro render) | In-page jump nav for long guides |
| `FAQ` | `FAQ.astro` | `items` (array of `{question, answer}`) | FAQ accordion + FAQPage JSON-LD |
| `ImageCaption` | `ImageCaption.astro` | `src`, `alt`, `caption?`, `credit?`, `loading?`, `width?`, `height?` | Image with caption and credit line |

## Monetization Components

| Component | File | Props | Purpose |
|-----------|------|-------|---------|
| `ProductGrid` | `ProductGrid.astro` | `products` (array of `{name, brand?, price?, url?, image?}`) | Affiliate product cards with `data-affiliate` tracking |
| `BookingCTA` | `BookingCTA.astro` | `links` (array of `{name, platform?, url?}`) | Hotel booking buttons with `data-booking` tracking |
| `ReservationCTA` | `ReservationCTA.astro` | `links` (array of `{name, platform?, url?}`) | Restaurant reservation buttons with `data-reservation` tracking |
| `AffiliateDisclosure` | `AffiliateDisclosure.astro` | (none) | FTC-compliant affiliate disclosure text |

## Engagement Components

| Component | File | Props | Purpose |
|-----------|------|-------|---------|
| `ShareBar` | `ShareBar.astro` | `title`, `url` | Share/copy buttons (Twitter, Facebook, Pinterest, copy link) |
| `NewsletterCTA` | `NewsletterCTA.astro` | `variant?` (`inline` \| `bold` \| `destination`), `destination?` | Contextual newsletter signup form |

## Layout

| File | Purpose |
|------|---------|
| `src/layouts/Base.astro` | Global layout: head, nav, footer, newsletter CTA, analytics scripts, JSON-LD |

## Usage Patterns

### Article Pages (`[pillar]/[slug].astro`)
Uses: Breadcrumbs, TableOfContents, AffiliateDisclosure, NewsletterCTA, ProductGrid, BookingCTA, ReservationCTA, FAQ, ShareBar, PostCard (for related/cluster posts)

### Category Pages (pillar indexes)
Uses: PostCard, PostGrid, FAQ (for pillar FAQ from cornerstone posts)

### Destination Hubs
Uses: PostCard, NewsletterCTA (destination variant)

### Homepage
Uses: PostCard
