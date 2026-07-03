#!/usr/bin/env node
/**
 * Convert archive content to main posts collection.
 * Maps archive frontmatter → posts frontmatter, organizes into pillar subdirs.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';

const ARCHIVE_DIR = './src/content/archive';
const POSTS_DIR = './src/content/posts';

// Map archive pillars to site pillars
const PILLAR_MAP = {
  business: 'business',
  culture: 'culture',
  finance: 'finance',
  travel: 'travel',
  lifestyle: 'lifestyle',
  tech: 'tech',
  food: 'food',
  entertainment: 'entertainment',
  general: 'culture', // fold general into culture
};

const files = readdirSync(ARCHIVE_DIR).filter(f => f.endsWith('.md'));
let count = 0;

for (const file of files) {
  const raw = readFileSync(join(ARCHIVE_DIR, file), 'utf-8');
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) {
    console.log(`SKIP (no frontmatter): ${file}`);
    continue;
  }

  const frontmatter = fmMatch[1];
  const body = fmMatch[2];

  // Parse key fields from frontmatter
  const get = (key) => {
    const m = frontmatter.match(new RegExp(`^${key}:\\s*"?(.*?)"?\\s*$`, 'm'));
    return m ? m[1] : '';
  };

  const title = get('title');
  const originalDate = get('originalDate');
  const excerpt = get('excerpt');
  const sourceUrl = get('sourceUrl');
  const pillarRaw = get('pillar');
  const wordCount = parseInt(get('wordCount') || '0', 10);
  const hasImages = get('hasImages') === 'true';

  // Get tags array
  const tagsMatch = frontmatter.match(/^tags:\s*\[(.*)\]/m);
  const tags = tagsMatch ? tagsMatch[1].replace(/"/g, '').split(',').map(t => t.trim()).filter(Boolean) : [];

  // Map pillar
  const pillar = PILLAR_MAP[pillarRaw] || 'culture';

  // Create pillar directory
  const pillarDir = join(POSTS_DIR, pillar);
  mkdirSync(pillarDir, { recursive: true });

  // Generate slug from filename
  const slug = file.replace('.md', '');

  // Build new frontmatter
  const metaDesc = excerpt.length > 160 ? excerpt.slice(0, 157) + '...' : (excerpt || title);

  // Pick a default image based on pillar
  const defaultImages = {
    business: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=675&fit=crop',
    culture: 'https://images.unsplash.com/photo-1533669955142-6a73332af4db?w=1200&h=675&fit=crop',
    finance: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=675&fit=crop',
    travel: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=675&fit=crop',
    lifestyle: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&h=675&fit=crop',
    tech: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=675&fit=crop',
    food: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=675&fit=crop',
    entertainment: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=675&fit=crop',
  };

  const image = defaultImages[pillar] || defaultImages.culture;

  const newFrontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
metaDescription: "${metaDesc.replace(/"/g, '\\"')}"
targetKeyword: "${tags[0] || pillar}"
pillar: "${pillar}"
contentType: "article"
date: "${originalDate}"
image: "${image}"
imageAlt: "${title.replace(/"/g, '\\"')}"
excerpt: "${excerpt.replace(/"/g, '\\"')}"
draft: false
featured: false
destinations: []
toc: false
sourceUrl: "${sourceUrl}"
---`;

  const output = newFrontmatter + '\n' + body;
  writeFileSync(join(pillarDir, file), output);
  count++;
}

console.log(`Converted ${count} archive posts to main posts collection.`);
console.log('Pillar directories created:');
for (const dir of readdirSync(POSTS_DIR)) {
  const files = readdirSync(join(POSTS_DIR, dir)).filter(f => f.endsWith('.md'));
  console.log(`  ${dir}: ${files.length} posts`);
}
