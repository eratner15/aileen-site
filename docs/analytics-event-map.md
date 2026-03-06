# Analytics Event Map

All analytics events fire via Google Analytics 4 (GA4). Events require `PUBLIC_GA_ID` to be set in `.env`.

## Events

| Event Name | Category | Trigger | Label | Location |
|------------|----------|---------|-------|----------|
| `outbound_click` | `affiliate` / `booking` / `reservation` | Click on `a[data-affiliate]`, `a[data-booking]`, or `a[data-reservation]` | Link href | `Base.astro` (global) |
| `newsletter_signup` | `engagement` | Newsletter form submission | Page pathname | `Base.astro` (global) |
| `toc_click` | `engagement` | Click on table of contents link | Link text | `Base.astro` (global) |
| `related_click` | `engagement` | Click on related post card | Link href | `Base.astro` (global) |
| `scroll_depth` | `engagement` | Scroll past 25%, 50%, 75%, 100% | Percentage (e.g., `75%`) | `Base.astro` (global) |
| `search` | `engagement` | Search input (debounced 1s, min 3 chars) | Search query | `search.astro` |

## Implementation Details

### Outbound Click Tracking
Links must have one of these data attributes:
- `data-affiliate` — product/affiliate links
- `data-booking` — hotel booking links
- `data-reservation` — restaurant reservation links

These are automatically added by `ProductGrid.astro`, `BookingCTA.astro`, and `ReservationCTA.astro`.

### Scroll Depth
Fires once per threshold per page load. Thresholds: 25%, 50%, 75%, 100%.

### Newsletter Signup
Currently frontend-only. Form shows "Thank you" on submit but does not send data to an email provider. GA4 event still fires for tracking purposes.

### Search Tracking
Debounced by 1 second. Only fires for queries of 3+ characters to avoid noise.

## Custom Dimensions (Recommended)
When GA4 is configured, consider adding custom dimensions for:
- `content_pillar` — travel, style, recipes, lifestyle
- `content_type` — article, restaurant-guide, hotel-review, etc.
- `destination` — miami, boston, etc.

These are available in frontmatter but not currently sent as event parameters.
