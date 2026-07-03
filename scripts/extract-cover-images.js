#!/usr/bin/env node
/**
 * Extract COVER images from original Substack HTML exports
 * and set them as the header image for each post.
 * The first <img> in each Substack HTML file is the cover image.
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, basename } from 'path';

const HTML_DIR = '/tmp/ratlinks-archive/posts';
const POSTS_DIR = './src/content/posts';

// Build map: slug → cover image URL from HTML files
const coverImages = {};

const htmlFiles = readdirSync(HTML_DIR).filter(f => f.endsWith('.html'));
for (const file of htmlFiles) {
  const slug = basename(file, '.html').replace(/^\d+\./, ''); // strip numeric prefix
  const html = readFileSync(join(HTML_DIR, file), 'utf-8');

  // Extract first img src - this is the cover/header image
  // Try substack-post-media first, then bucketeer (older posts)
  let imgMatch = html.match(/img\s+src="(https:\/\/substack-post-media\.s3\.amazonaws\.com\/public\/images\/[^"]+)"/);
  if (!imgMatch) {
    imgMatch = html.match(/img\s+src="(https:\/\/bucketeer[^"]+)"/);
  }
  if (!imgMatch) {
    // Try any https image
    imgMatch = html.match(/img\s+src="(https:\/\/[^"]+\.(jpg|jpeg|png|gif|webp)[^"]*)"/i);
  }

  if (imgMatch) {
    coverImages[slug] = imgMatch[1];
  }
}

console.log(`Found cover images for ${Object.keys(coverImages).length} HTML files`);

// Now update posts
const pillars = readdirSync(POSTS_DIR).filter(d => {
  try { return readdirSync(join(POSTS_DIR, d)).some(f => f.endsWith('.md')); }
  catch { return false; }
});

let updated = 0;
let noMatch = 0;
let noImage = 0;

for (const pillar of pillars) {
  const dir = join(POSTS_DIR, pillar);
  const files = readdirSync(dir).filter(f => f.endsWith('.md'));

  for (const file of files) {
    const slug = basename(file, '.md');
    const coverUrl = coverImages[slug];

    if (!coverUrl) {
      noMatch++;
      continue;
    }

    const path = join(dir, file);
    const raw = readFileSync(path, 'utf-8');
    const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!fmMatch) continue;

    const fm = fmMatch[1];
    const body = fmMatch[2];

    // Replace image line with cover image
    const newFm = fm.replace(/^image:\s*".*"$/m, `image: "${coverUrl}"`);
    writeFileSync(path, `---\n${newFm}\n---\n${body}`);
    updated++;
  }
}

console.log(`Updated: ${updated} posts with their Substack cover image`);
console.log(`No HTML match: ${noMatch} posts (keeping existing image)`);
