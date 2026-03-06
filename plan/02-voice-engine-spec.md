# Artifact 2: Voice Engine Specification

## Purpose

The Voice Engine is the system that extracts, stores, validates, and enforces Aileen's editorial voice across every piece of content — whether written by her, by a freelancer, or by AI Assist. It is the single most important differentiator between "another lifestyle blog" and a brand readers trust and return to.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                 VOICE ENGINE                      │
│                                                   │
│  ┌──────────────┐   ┌──────────────────────────┐ │
│  │ Voice Profile │   │ Voice Rules (structured)  │ │
│  │ (prose, human │   │ JSON config: constraints, │ │
│  │  readable)    │   │ patterns, scoring weights │ │
│  └──────┬───────┘   └──────────┬───────────────┘ │
│         │                      │                   │
│  ┌──────▼──────────────────────▼───────────────┐  │
│  │         Prompt Conditioning Layer             │  │
│  │  system prompts per content type + channel    │  │
│  └──────────────────────┬──────────────────────┘  │
│                         │                          │
│  ┌──────────────────────▼──────────────────────┐  │
│  │            Voice Validator                    │  │
│  │  post-generation scoring: 0-100               │  │
│  │  blocklist check + pattern match + LLM judge  │  │
│  └──────────────────────┬──────────────────────┘  │
│                         │                          │
│  ┌──────────────────────▼──────────────────────┐  │
│  │            Voice Corpus                       │  │
│  │  canonical examples indexed by content type   │  │
│  └─────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

---

## Component 1: Voice Profile (Prose)

### What it is
A human-readable document that captures how Aileen writes — her tone, rhythm, vocabulary, perspective, and editorial instincts. This is the document a new writer or freelancer would read before writing for the brand.

### Current state
`growth-engine/voice-profile.md` — EXISTS. Covers tone, sentence structure, word preferences, blocklist, post structure by type, and example phrases. Solid foundation but needs expansion.

### What must be added

**A. Editorial Positioning Model**
Codify the brand's editorial identity as explicit axes:

| Axis | Aileen's Position | Anti-Position |
|------|-------------------|---------------|
| Breadth vs. Depth | Curated, not exhaustive | "50 Best Restaurants" listicles |
| Volume vs. Selection | Selective, not maximalist | Covering everything in a city |
| Authority Style | Confident, not loud | "OMG you HAVE to try this" |
| Luxury Register | Practical luxury, not flashy | Name-dropping for status |
| Novelty vs. Return | Return-oriented, not trend-chasing | "Just opened" hype posts |
| Utility vs. Entertainment | Tasteful utility, not content-farm energy | SEO-stuffed filler |
| Commercial Tone | Editorial, not salesy | "Shop my link" / affiliate-first |

**B. Content Heuristics**
How Aileen makes recommendations, codified as decision rules:

| Content Type | "Worth It" Signal | Red Flag |
|---|---|---|
| Restaurant | "I go back" — repeat visits, specific dishes named | One-visit reviews, no specifics |
| Hotel | Rebookable — would stay again, specific rooms/features | Generic "beautiful lobby" language |
| Style Item | Timeless — earns its place, works across seasons | Trend-dependent, one-season items |
| Travel Guide | Useful but elevated — real logistics + editorial taste | Regurgitated tourist info |
| Recipe | Personal context + achievable elegance | Restaurant-complex or too basic |

**C. Voice by Content Type**
Each content type has slight voice variations:

| Type | Voice Shift |
|---|---|
| Restaurant Guide | Specific, sensory, return-oriented. Names dishes. "The cacio e pepe is the reason to go." |
| Style Post | Authoritative, referential, timeless framing. "This is what lasts." |
| Travel Guide | Practical warmth. Real logistics. "Here's exactly what to do." |
| Hotel Review | Experiential detail. Specific rooms, touches, feelings. "The kind of hotel that..." |
| Recipe | Brief personal context, then clean instruction. No life story preamble. |
| Newsletter | More intimate. "I've been meaning to tell you about..." First-person, conversational. |
| Pinterest | Shorter, search-optimized, but still Aileen's vocabulary. No generic hooks. |
| Social (IG/TikTok) | Most casual. Can be fragmentary. Still never uses blocklisted language. |

### How this strengthens the flywheel
The prose profile is the source of truth that everything else derives from. Better voice documentation → better AI output → less editing time → faster publishing → more content → more compounding.

### How this preserves voice
It IS the voice. Everything downstream references this document.

### How this improves client ownership
Aileen can hand this to any writer, any AI tool, any agency, and they produce on-brand content. Her voice is an asset she owns, not tribal knowledge locked in someone's head.

---

## Component 2: Voice Rules (Structured Config)

### What it is
A machine-readable JSON configuration that the AI service layer and validation system consume. The prose profile is for humans; the rules config is for code.

### Current state
Only exists as a 15-word blocklist array in `writer.js`. No structured config file.

### Target: `voice-rules.json`

```json
{
  "version": "1.0",

  "blocklist": {
    "words": [
      "vibes", "aesthetic", "hack", "obsessed", "game-changer", "slay",
      "nestled", "boasts", "plethora", "delve", "stunning", "amazing",
      "incredible", "ultimate", "gorgeous", "breathtaking", "jaw-dropping",
      "hidden gem", "bucket list", "wanderlust", "foodie", "yummy",
      "scrumptious", "mouthwatering"
    ],
    "phrases": [
      "let's dive in",
      "in today's fast-paced world",
      "whether you're a ... or a ...",
      "look no further",
      "without further ado",
      "it's important to note",
      "a must-have",
      "comprehensive guide",
      "everything you need to know",
      "I'm so excited to share",
      "you won't want to miss",
      "trust me on this one",
      "if you know, you know",
      "that said",
      "at the end of the day"
    ],
    "patterns": [
      "^Let's (?:dive|jump|get) (?:in|into|started)",
      "(?:I'm|I am) (?:so |really )?(?:obsessed|excited|thrilled)",
      "you (?:guys|all) (?:know|asked)",
      "(?:best|top|ultimate) \\d+ (?:things|places|restaurants|hotels)"
    ]
  },

  "preferred": {
    "constructions": [
      "the kind of [noun] that [quality]",
      "worth [gerund]: worth the reservation, worth knowing, worth returning to",
      "the ones I go back to",
      "what's actually worth it",
      "no fluff, no filler"
    ],
    "vocabulary": [
      "elegant", "timeless", "refined", "intentional", "curated",
      "thoughtful", "polished", "considered", "understated", "assured"
    ],
    "openings": {
      "restaurant_guide": "City context statement, then personal stake",
      "style_post": "Concept framing, then why it matters now",
      "travel_guide": "Destination mood-setting, then practical promise",
      "hotel_review": "Experiential hook, then specific detail",
      "recipe": "Brief personal context (2-3 sentences max), then straight to cooking",
      "newsletter": "Intimate, first-person, conversational greeting"
    }
  },

  "structure": {
    "sentence_rhythm": "Mix short declarative (5-10 words) with longer flowing (15-25 words). Short lands the point. Long paints the picture.",
    "paragraph_length": "2-4 sentences. Never walls of text.",
    "h2_style": "Descriptive, not clickbait. 'Where to Stay' not '10 AMAZING Hotels You NEED to Book'",
    "closing_style": "Opinion stated as fact, no hedging. Quiet confidence.",
    "perspective": {
      "personal_takes": "first person singular: I go back to, I recommend",
      "editorial_authority": "first person plural: we focus on what lasts"
    }
  },

  "scoring": {
    "weights": {
      "blocklist_violation": -15,
      "pattern_violation": -10,
      "preferred_construction_used": 5,
      "preferred_vocabulary_used": 2,
      "sentence_rhythm_balanced": 10,
      "paragraph_length_appropriate": 5,
      "opening_matches_type": 10,
      "closing_has_confidence": 5,
      "affiliate_natural_placement": 5,
      "no_hedging_language": 5
    },
    "thresholds": {
      "publish_ready": 75,
      "needs_editing": 50,
      "rewrite_required": 0
    }
  },

  "channel_variants": {
    "blog": {
      "formality": 3.5,
      "max_exclamation_marks": 0,
      "emoji_allowed": false
    },
    "newsletter": {
      "formality": 3.0,
      "max_exclamation_marks": 1,
      "emoji_allowed": false,
      "tone_shift": "slightly more intimate and conversational"
    },
    "pinterest": {
      "formality": 3.0,
      "max_exclamation_marks": 0,
      "emoji_allowed": false,
      "tone_shift": "shorter, search-optimized, still Aileen's vocabulary"
    },
    "instagram": {
      "formality": 2.5,
      "max_exclamation_marks": 1,
      "emoji_allowed": true,
      "tone_shift": "most casual, can be fragmentary"
    }
  }
}
```

### How this strengthens the flywheel
Machine-readable rules enable automated validation. Every draft is scored before Aileen sees it. Bad drafts get caught by code, not by her time.

### How this preserves voice
The blocklist and patterns catch the most common AI voice failures. The scoring weights encode what matters most. The channel variants ensure voice adapts appropriately per platform without drifting.

### How this improves client ownership
The config is a portable asset. If Aileen switches AI providers, CMS platforms, or hires writers, the rules travel with her.

### How this helps compounding
Automated enforcement means quality doesn't degrade as volume increases. Publishing 12 posts/month at consistent voice quality is what compounds — 12 posts with inconsistent voice is noise.

---

## Component 3: Prompt Conditioning Layer

### What it is
System prompt templates that condition AI Assist output per content type and channel. Each template injects the voice profile, relevant rules, and content-type-specific instructions.

### Current state
`writer.js` has a single system prompt that concatenates the voice profile + SEO requirements + blocklist. No content-type specialization. No channel variants.

### Target: Prompt Template System

```
prompts/
├── base-voice.txt          ← voice profile + rules (injected into all)
├── blog/
│   ├── restaurant-guide.txt
│   ├── style-post.txt
│   ├── travel-guide.txt
│   ├── hotel-review.txt
│   ├── recipe.txt
│   └── lifestyle.txt
├── newsletter/
│   ├── weekly-edit.txt
│   └── destination-special.txt
├── social/
│   ├── instagram-caption.txt
│   ├── tiktok-caption.txt
│   └── pinterest-pin.txt
├── seo/
│   ├── meta-description.txt
│   ├── title-options.txt
│   └── faq-suggestions.txt
└── editorial/
    ├── brief-generator.txt
    ├── outline-generator.txt
    ├── rewrite-block.txt
    ├── refresh-suggestions.txt
    └── commerce-blurb.txt
```

### Template Structure (example: restaurant guide)

```
[BASE VOICE INJECTION]

You are writing a RESTAURANT GUIDE for AILEEN Magazine.

CONTENT-TYPE RULES:
- Open with city context, then personal stake ("the ones I go back to")
- Each restaurant entry: name, neighborhood, what to order, why it's worth it
- Mention specific dishes — not "the food is great" but "the cacio e pepe is the reason to go"
- Include return-visit framing — readers should feel these are tested, not one-off visits
- End with a confident closer, no "happy eating!" energy

VOICE SHIFT FOR THIS TYPE:
- More sensory than style posts
- More specific than travel guides
- "Worth the reservation" language encouraged
- Name actual dishes, actual drinks, actual rooms

SEO REQUIREMENTS:
[injected per post]

INTERNAL LINKING:
[injected from existing content]

AFFILIATE PLACEMENTS:
- Restaurant reservation links (Resy, OpenTable) placed naturally
- No "book through my link" language
- Reservation CTAs at section end, not mid-paragraph
```

### How this strengthens the flywheel
Content-type-specific prompts produce dramatically better first drafts. Better first drafts → less editing time → faster publishing → more content.

### How this preserves voice
Each content type has its own voice calibration. A restaurant guide sounds different from a style post, but both sound like Aileen. Generic one-size-fits-all prompts produce generic output.

### How this improves client ownership
Prompt templates are visible, editable assets. Aileen can tweak "how restaurant guides should sound" without touching code.

### How this helps compounding
As the prompt library grows, every content type gets faster to produce. New content types (e.g., "destination hub intro") can be added as new templates without redesigning the system.

---

## Component 4: Voice Validator

### What it is
An automated scoring system that evaluates any piece of content against the voice rules and returns a score (0-100) with specific feedback. Runs after AI generation and before human review.

### Current state
`writer.js` has `qualityCheck()` — keyword placement + word count + blocklist only. No voice scoring. No LLM-based judgment.

### Target: Two-Layer Validation

**Layer 1: Rule-Based (fast, deterministic)**

Checks that can run without an LLM call:

| Check | Method | Score Impact |
|---|---|---|
| Blocklist words/phrases | String match against `voice-rules.json` blocklist | -15 per violation |
| Pattern violations | Regex match against patterns array | -10 per violation |
| Exclamation marks | Count `!` against channel limit | -5 per excess |
| Emoji usage | Check against channel `emoji_allowed` | -5 if disallowed |
| Sentence length variation | Std dev of sentence lengths — too uniform = bad | +10 if balanced |
| Paragraph length | Flag paragraphs >5 sentences | -3 per violation |
| Hedging language | Detect "I think", "maybe", "possibly", "sort of" | -5 per instance |
| Keyword density | SEO keyword appears in title + intro + 2 H2s | Pass/fail |
| Internal links | ≥3 internal links present | Pass/fail |

**Layer 2: LLM-Based (deeper, costs one API call)**

A focused evaluation prompt that scores voice alignment:

```
You are a voice consistency evaluator for AILEEN Magazine.

Given the VOICE PROFILE below and the DRAFT CONTENT, score the draft
on these dimensions (each 0-20, total 0-100):

1. TONE (0-20): Does it sound like Aileen? Confident but not loud,
   warm but not gushing, authoritative but not preachy?

2. SPECIFICITY (0-20): Does it name specific dishes, rooms, pieces,
   places? Or is it vague and generic?

3. RHYTHM (0-20): Is there a mix of short declarative sentences and
   longer flowing ones? Or is every sentence the same length?

4. EDITORIAL CONFIDENCE (0-20): Does it state opinions as facts?
   Or does it hedge with "I think" / "you might like" / "consider"?

5. ANTI-PATTERN AVOIDANCE (0-20): Does it avoid sounding like a
   generic SEO blog, an influencer, or a content farm?

Return a JSON object:
{
  "tone": { "score": N, "notes": "..." },
  "specificity": { "score": N, "notes": "..." },
  "rhythm": { "score": N, "notes": "..." },
  "confidence": { "score": N, "notes": "..." },
  "anti_patterns": { "score": N, "notes": "..." },
  "total": N,
  "verdict": "publish_ready | needs_editing | rewrite_required",
  "top_issues": ["...", "..."],
  "suggested_rewrites": [
    { "original": "...", "suggested": "...", "reason": "..." }
  ]
}
```

### Validation Flow

```
Draft Generated
      │
      ▼
Layer 1: Rule-Based Check (instant)
      │
      ├── FAIL (score < 50) → Return to AI with specific fix instructions
      │                         (auto-retry once, then flag for human)
      │
      ▼
Layer 2: LLM Voice Score (~5 sec)
      │
      ├── rewrite_required (< 50) → Flag for human with issues + rewrites
      ├── needs_editing (50-74)    → Show draft with inline suggestions
      └── publish_ready (75+)      → Show draft with green confidence indicator
```

### How this strengthens the flywheel
Validation catches bad content before it reaches Aileen. She spends time editing good drafts, not rejecting bad ones. Her time is the bottleneck — protecting it is the highest-leverage optimization.

### How this preserves voice
Two-layer validation catches both mechanical violations (blocklist) and subtle drift (tone, rhythm). The LLM judge is specifically trained to detect the difference between "sounds like Aileen" and "sounds like generic lifestyle content."

### How this improves client ownership
Aileen can see the voice score for every draft. If she disagrees with a score, the feedback loop improves the system. The scoring thresholds are configurable — she decides what "good enough" means.

### How this helps compounding
As more content passes through the validator, the system learns what scores correlate with Aileen's actual edits. The voice corpus grows, LLM judge examples improve, and validation gets more accurate over time.

---

## Component 5: Voice Corpus

### What it is
A curated collection of canonical Aileen content, indexed by content type, that serves as few-shot examples for AI Assist and as the ground truth for the LLM voice judge.

### Current state
No corpus exists. The voice profile has 6 example phrases but no full-length examples.

### Target: Indexed Example Library

```
voice-corpus/
├── restaurant-guides/
│   ├── best-restaurants-miami.md      (canonical example)
│   ├── best-restaurants-palm-beach.md
│   └── _index.json                    (metadata: type, length, voice score)
├── style-posts/
│   ├── quiet-luxury-brands.md
│   └── _index.json
├── travel-guides/
│   ├── boston-travel-guide.md
│   └── _index.json
├── recipes/
│   └── _index.json
├── newsletters/
│   └── _index.json
└── corpus-manifest.json               (all entries, used for prompt selection)
```

### How Examples Are Used

1. **AI Assist drafting**: When generating a restaurant guide, the system pulls 1-2 canonical restaurant guide examples into the prompt as few-shot demonstrations
2. **Voice Validator LLM judge**: The judge sees the canonical example alongside the draft to calibrate its scoring
3. **Human reference**: Writers can read canonical examples to understand the standard
4. **Corpus growth**: When Aileen publishes a post and marks it as "voice-approved," it can be added to the corpus

### Selection Logic
- Match by content type first
- Match by destination if available (Miami restaurant corpus for a Miami restaurant draft)
- Limit to 2 examples per prompt (token budget)
- Prefer shorter, punchier examples over long guides

### How this strengthens the flywheel
More published content → larger corpus → better few-shot examples → better AI drafts → faster publishing → more content. This is the self-reinforcing loop that makes the voice engine improve over time.

### How this preserves voice
The corpus IS Aileen's voice in concrete form. It's not rules about voice — it's actual examples of voice done right. LLMs learn better from examples than from instructions.

### How this improves client ownership
The corpus is Aileen's intellectual property — her best writing, organized and indexed. It's the most valuable asset in the system.

---

## Implementation Priority

| Priority | Component | Effort | Dependencies |
|---|---|---|---|
| 1 | Voice Rules JSON | 2 hrs | None — can extract from existing voice-profile.md |
| 2 | Expanded Voice Profile | 3 hrs | Analyze existing published content on aileenlavin.com |
| 3 | Voice Corpus (initial) | 2 hrs | Use 4 existing posts as seed corpus |
| 4 | Prompt Templates (core 5) | 4 hrs | Voice Rules + Voice Profile |
| 5 | Rule-Based Validator | 3 hrs | Voice Rules JSON |
| 6 | LLM Voice Scorer | 4 hrs | Voice Profile + Corpus + Prompt Templates |
| 7 | Prompt Templates (full set) | 4 hrs | After core 5 validated |
| 8 | Corpus Growth Pipeline | 2 hrs | Voice Validator working |

### Integration Points

- **Writer agent** (`growth-engine/src/agents/writer.js`): Replace single system prompt with prompt template loader + voice rules injection
- **CLI** (`growth-engine/src/cli.js`): Add `aileen voice-check <file>` command for standalone voice validation
- **Deploy bridge** (`growth-engine/src/deploy.js`): Run voice validator before deploying to Astro site
- **Admin UI** (future): Voice score displayed on every draft, corpus management interface
- **Content schema** (`aileen-site/src/content.config.ts`): Add `voiceScore: z.number().optional()` field

---

## What Success Looks Like

1. Every AI-generated draft scores 70+ on voice alignment before Aileen sees it
2. Aileen's editing time per post drops from 45+ minutes to 15-20 minutes
3. A new writer could read the Voice Profile + see 3 corpus examples and produce on-brand content
4. The system catches 95%+ of blocklist violations and 80%+ of tone drift automatically
5. As the corpus grows, AI drafts become indistinguishable from Aileen's own writing at first read
