# Known Issues & Next Enhancements

## Known Issues

### Critical (External Dependencies)
| Issue | Impact | Resolution |
|-------|--------|------------|
| Newsletter form has no backend | Zero subscribers captured | Connect Mailchimp/ConvertKit API |
| GA4 not configured | Zero analytics data | Create GA4 property, set `PUBLIC_GA_ID` |
| All images are Unsplash placeholders | No real content photography | Replace with original/licensed images |
| Only 4 published posts | Most category pages appear empty | Run growth engine content pipeline |
| All affiliate/booking URLs are placeholders | Zero monetization | Sign up for affiliate programs |

### Medium (Fixable)
| Issue | Impact | Resolution |
|-------|--------|------------|
| Pinterest verification code empty | No rich pin validation | Add verification code to `.env` |
| Admin dashboards are read-only | No inline editing | Phase 2: growth engine interactive buttons |
| Performance dashboard sessions hardcoded to 0 | Misleading metric | Wire GA4 API or env var for real sessions |
| No redirect system | URL changes break old links | Add redirect map to `worker.js` |

## Next Enhancements

### Priority 1: Content Infrastructure
1. Connect newsletter to email provider (Mailchimp/ConvertKit)
2. Configure GA4 property and set `PUBLIC_GA_ID`
3. Run growth engine to produce 12+ posts/month
4. Replace Unsplash placeholders with real photography

### Priority 2: Features
5. Author page (`/magazine/about/aileen/`)
6. Favorites/shop page for curated product links
7. Trending/popular module based on actual traffic data
8. Promo banner system for seasonal campaigns

### Priority 3: Monetization
9. Sign up for affiliate programs (ShopStyle, RewardStyle, Hotels.com)
10. Add real booking/reservation URLs
11. Mediavine ad integration at 50K sessions

### Priority 4: Technical
12. Image optimization pipeline (Cloudflare Images or similar)
13. Worker-level redirect map for URL changes
14. Interactive admin dashboard (Phase 2)
15. A/B testing for newsletter CTA variants
