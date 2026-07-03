#!/usr/bin/env node
/**
 * Extract the first image from each post's markdown body
 * and use it as the header/og image in frontmatter.
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const POSTS_DIR = './src/content/posts';

const pillars = readdirSync(POSTS_DIR).filter(d => {
  try { return readdirSync(join(POSTS_DIR, d)).some(f => f.endsWith('.md')); }
  catch { return false; }
});

let updated = 0;
let kept = 0;

for (const pillar of pillars) {
  const dir = join(POSTS_DIR, pillar);
  const files = readdirSync(dir).filter(f => f.endsWith('.md'));

  for (const file of files) {
    const path = join(dir, file);
    const raw = readFileSync(path, 'utf-8');
    const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!fmMatch) continue;

    const fm = fmMatch[1];
    const body = fmMatch[2];

    // Find first image in markdown body
    // Matches ![alt](url) or ![](url)
    const imgMatch = body.match(/!\[.*?\]\((https?:\/\/[^\s)]+)\)/);

    if (imgMatch) {
      const imgUrl = imgMatch[1];
      const newFm = fm.replace(/^image:\s*".*"$/m, `image: "${imgUrl}"`);
      writeFileSync(path, `---\n${newFm}\n---\n${body}`);
      updated++;
    } else {
      kept++;
    }
  }
}

console.log(`Updated: ${updated} posts with their own blog images`);
console.log(`Kept existing: ${kept} posts (no embedded images found)`);
