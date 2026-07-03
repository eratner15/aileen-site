#!/usr/bin/env node
/**
 * Fetch the actual og:image from each Substack post page.
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const POSTS_DIR = './src/content/posts';

const posts = [];
const pillars = readdirSync(POSTS_DIR).filter(d => {
  try { return readdirSync(join(POSTS_DIR, d)).some(f => f.endsWith('.md')); }
  catch { return false; }
});

for (const pillar of pillars) {
  const dir = join(POSTS_DIR, pillar);
  for (const file of readdirSync(dir).filter(f => f.endsWith('.md'))) {
    const path = join(dir, file);
    const raw = readFileSync(path, 'utf-8');
    const urlMatch = raw.match(/^sourceUrl:\s*"(.*)"$/m);
    if (urlMatch) {
      posts.push({ path, url: urlMatch[1] });
    }
  }
}

console.log(`Found ${posts.length} posts with sourceUrl`);

async function fetchOgImage(url) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible)' },
      redirect: 'follow',
      signal: AbortSignal.timeout(15000),
    });
    const html = await res.text();

    // Match og:image with any attributes in between
    const ogMatch = html.match(/property="og:image"\s+content="([^"]+)"/i);

    if (ogMatch) {
      let ogUrl = ogMatch[1];
      // Extract the raw S3 image URL from the Substack CDN wrapper
      const s3Match = ogUrl.match(/https%3A%2F%2Fsubstack-post-media\.s3\.amazonaws\.com%2Fpublic%2Fimages%2F([^"&]+)/);
      if (s3Match) {
        return `https://substack-post-media.s3.amazonaws.com/public/images/${decodeURIComponent(s3Match[1])}`;
      }
      const bucketMatch = ogUrl.match(/https%3A%2F%2Fbucketeer[^"&]+/);
      if (bucketMatch) {
        return decodeURIComponent(bucketMatch[0]);
      }
      // Return the CDN wrapper URL itself if we can't extract raw
      return ogUrl;
    }
    return null;
  } catch (e) {
    return null;
  }
}

let updated = 0;
let failed = 0;
const BATCH = 5;

for (let i = 0; i < posts.length; i += BATCH) {
  const batch = posts.slice(i, i + BATCH);
  const results = await Promise.all(
    batch.map(async (post) => {
      const ogImage = await fetchOgImage(post.url);
      return { ...post, ogImage };
    })
  );

  for (const { path, ogImage } of results) {
    if (ogImage) {
      const raw = readFileSync(path, 'utf-8');
      writeFileSync(path, raw.replace(/^image:\s*".*"$/m, `image: "${ogImage}"`));
      updated++;
      process.stdout.write('.');
    } else {
      failed++;
      process.stdout.write('x');
    }
  }
}

console.log(`\nUpdated: ${updated}, Failed: ${failed}`);
