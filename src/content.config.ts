import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    metaDescription: z.string(),
    targetKeyword: z.string(),
    pillar: z.enum(['travel', 'style', 'recipes', 'lifestyle']),
    contentType: z.enum([
      'article',
      'restaurant-guide',
      'hotel-review',
      'travel-guide',
      'style-guide',
      'recipe',
      'the-edit',
      'destination-hub',
    ]).default('article'),
    date: z.string(),
    updatedDate: z.string().optional(),
    image: z.string(),
    imageAlt: z.string(),
    excerpt: z.string(),
    author: z.string().default('Aileen Lavin'),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    featuredOrder: z.number().optional(),
    destinations: z.array(z.string()).default([]),
    faq: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).default([]),
    products: z.array(z.object({
      name: z.string(),
      brand: z.string().optional(),
      price: z.string().optional(),
      url: z.string().optional(),
      image: z.string().optional(),
    })).default([]),
    bookingLinks: z.array(z.object({
      name: z.string(),
      platform: z.string().optional(),
      url: z.string().optional(),
    })).default([]),
    reservationLinks: z.array(z.object({
      name: z.string(),
      platform: z.string().optional(),
      url: z.string().optional(),
    })).default([]),
    // Restaurant guide fields
    restaurants: z.array(z.object({
      name: z.string(),
      description: z.string().optional(),
      whyItStandsOut: z.string().optional(),
      address: z.string().optional(),
      reservationUrl: z.string().optional(),
      cuisine: z.string().optional(),
      priceRange: z.string().optional(),
      neighborhood: z.string().optional(),
    })).default([]),
    quickPicks: z.array(z.string()).default([]),
    // Hotel review fields
    hotelDetails: z.object({
      propertyName: z.string().optional(),
      propertyType: z.string().optional(),
      priceTier: z.string().optional(),
      goodFor: z.array(z.string()).default([]),
      standoutFeatures: z.array(z.string()).default([]),
      alternatives: z.array(z.string()).default([]),
    }).optional(),
    // Recipe-specific fields
    prepTime: z.string().optional(),
    cookTime: z.string().optional(),
    totalTime: z.string().optional(),
    servings: z.string().optional(),
    ingredients: z.array(z.string()).default([]),
    instructions: z.array(z.string()).default([]),
    nutrition: z.object({
      calories: z.string().optional(),
      servingSize: z.string().optional(),
    }).optional(),
    affiliateDisclosure: z.boolean().default(false),
    relatedPosts: z.array(z.string()).default([]),
    voiceScore: z.number().optional(),
    seoScore: z.number().optional(),
    pinsGenerated: z.number().default(0),
    newsletterIncluded: z.boolean().default(false),
    toc: z.boolean().default(false),
    // Spec additions
    cornerstone: z.boolean().default(false),
    subcategory: z.string().optional(),
    ogTitle: z.string().optional(),
    ogDescription: z.string().optional(),
    imageCaption: z.string().optional(),
    imageCredit: z.string().optional(),
    canonicalOverride: z.string().optional(),
    season: z.string().optional(),
    newsletterCTAVariant: z.enum(['inline', 'bold', 'destination', 'shopping']).optional(),
    // Content lifecycle (new)
    status: z.enum(['draft', 'in-review', 'scheduled', 'published', 'refresh-needed']).default('published'),
    scheduledDate: z.string().optional(),
    refreshDate: z.string().optional(),
    // Distribution tracking (new)
    distributedNewsletter: z.boolean().default(false),
    distributedPinterest: z.boolean().default(false),
    distributedInstagram: z.boolean().default(false),
    distributedTiktok: z.boolean().default(false),
    // Monetization (new)
    monetizationType: z.enum(['affiliate', 'booking', 'reservation', 'the-edit', 'none']).default('none'),
    disclosureAdded: z.boolean().default(false),
    // Trust methodology note (new)
    trustNote: z.string().optional(),
  }),
});

export const collections = { posts };
