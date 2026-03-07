#!/usr/bin/env node
/**
 * Archive Ingestion Script
 * Parses Substack/RatLinks export (posts.csv + HTML files) into
 * structured markdown content files for the archive collection.
 *
 * Usage: node scripts/ingest-archive.js /path/to/extracted/archive
 */

import fs from 'fs';
import path from 'path';

const archiveDir = process.argv[2];
if (!archiveDir) {
  console.error('Usage: node scripts/ingest-archive.js /path/to/extracted/archive');
  process.exit(1);
}

const outputDir = path.resolve('src/content/archive');
fs.mkdirSync(outputDir, { recursive: true });

// --- Parse posts.csv ---
const csvPath = path.join(archiveDir, 'posts.csv');
const csvRaw = fs.readFileSync(csvPath, 'utf-8');

function parseCSV(raw) {
  const lines = [];
  let current = '';
  let inQuotes = false;
  for (const char of raw) {
    if (char === '"') {
      inQuotes = !inQuotes;
      current += char;
    } else if (char === '\n' && !inQuotes) {
      lines.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  if (current.trim()) lines.push(current);

  const headers = parseCSVLine(lines[0]);
  return lines.slice(1).filter(l => l.trim()).map(line => {
    const values = parseCSVLine(line);
    const obj = {};
    headers.forEach((h, i) => { obj[h] = values[i] || ''; });
    return obj;
  });
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

const posts = parseCSV(csvRaw);
console.log(`Found ${posts.length} posts in CSV`);

// --- HTML to Markdown conversion (lightweight) ---
function htmlToMarkdown(html) {
  if (!html) return '';

  let md = html;

  // Remove Substack-specific wrapper elements
  md = md.replace(/<div class="captioned-image-container">.*?<\/div>/gs, (match) => {
    const imgMatch = match.match(/src="(https:\/\/substack[^"]+)"/);
    const altMatch = match.match(/alt="([^"]*)"/);
    if (imgMatch) {
      return `\n![${altMatch?.[1] || ''}](${imgMatch[1]})\n`;
    }
    return '';
  });

  // Headers
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '\n# $1\n');
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n## $1\n');
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n### $1\n');
  md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '\n#### $1\n');

  // Bold and italic
  md = md.replace(/<strong>(.*?)<\/strong>/gi, '**$1**');
  md = md.replace(/<b>(.*?)<\/b>/gi, '**$1**');
  md = md.replace(/<em>(.*?)<\/em>/gi, '*$1*');
  md = md.replace(/<i>(.*?)<\/i>/gi, '*$1*');

  // Links
  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');

  // Images
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)');
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, '![]($1)');

  // Lists
  md = md.replace(/<ul[^>]*>/gi, '\n');
  md = md.replace(/<\/ul>/gi, '\n');
  md = md.replace(/<ol[^>]*>/gi, '\n');
  md = md.replace(/<\/ol>/gi, '\n');
  md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1');

  // Paragraphs and breaks
  md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '\n$1\n');
  md = md.replace(/<br\s*\/?>/gi, '\n');
  md = md.replace(/<hr\s*\/?>/gi, '\n---\n');

  // Blockquotes
  md = md.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, (_, content) => {
    return content.split('\n').map(l => `> ${l.trim()}`).join('\n');
  });

  // Remove remaining HTML tags
  md = md.replace(/<[^>]+>/g, '');

  // Decode HTML entities
  md = md.replace(/&amp;/g, '&');
  md = md.replace(/&lt;/g, '<');
  md = md.replace(/&gt;/g, '>');
  md = md.replace(/&quot;/g, '"');
  md = md.replace(/&#39;/g, "'");
  md = md.replace(/&nbsp;/g, ' ');
  md = md.replace(/&#x200B;/g, '');

  // Clean up excessive whitespace
  md = md.replace(/\n{4,}/g, '\n\n\n');
  md = md.trim();

  return md;
}

// --- Auto-classify content ---
function classifyPillar(title, subtitle, body) {
  const text = `${title} ${subtitle} ${body}`.toLowerCase();

  const scores = {
    business: 0, finance: 0, tech: 0, culture: 0,
    travel: 0, food: 0, entertainment: 0, lifestyle: 0, general: 0,
  };

  // Business keywords
  if (/startup|entrepreneur|business|company|market|brand|revenue|profit|growth|monetiz|arbitrage|invest/i.test(text)) scores.business += 3;
  if (/ceo|founder|ipo|valuation|venture|capital|pitch/i.test(text)) scores.business += 2;

  // Finance
  if (/stock|crypto|bitcoin|portfolio|hedge fund|trading|wall street|inflation|recession|market top|market bottom/i.test(text)) scores.finance += 3;
  if (/meme.?stock|nft|blockchain|defi/i.test(text)) scores.finance += 2;

  // Tech
  if (/\bai\b|artificial intelligence|robot|algorithm|software|app\b|platform|automation|generative/i.test(text)) scores.tech += 3;
  if (/silicon valley|startup|saas|machine learning/i.test(text)) scores.tech += 2;

  // Culture
  if (/music|concert|album|film|movie|book|museum|art\b|culture|nostalgia|fashion/i.test(text)) scores.culture += 3;
  if (/taylor swift|celebrity|famous|aging rocker|rap|hip.?hop/i.test(text)) scores.culture += 2;

  // Travel
  if (/travel|national park|hotel|destination|flight|vacation|road trip|tourist/i.test(text)) scores.travel += 3;
  if (/miami|new york|las vegas|europe|park|hiking/i.test(text)) scores.travel += 2;

  // Food
  if (/restaurant|chef|recipe|food|cooking|wine|beer|dining|cheese/i.test(text)) scores.food += 3;
  if (/kitchen|ingredient|menu|taste/i.test(text)) scores.food += 2;

  // Entertainment
  if (/sport|football|basketball|baseball|nba|nfl|mlb|gambling|betting|casino|poker/i.test(text)) scores.entertainment += 3;
  if (/game|play|fantasy|draft|copa|world cup/i.test(text)) scores.entertainment += 2;

  // Lifestyle
  if (/life|goal|routine|habit|mindset|passion|mastery|self.?improvement|productivity/i.test(text)) scores.lifestyle += 3;
  if (/blood bank|donat|volunteer|pardon|holiday/i.test(text)) scores.lifestyle += 2;

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return sorted[0][1] > 0 ? sorted[0][0] : 'general';
}

function extractTags(title, subtitle, body) {
  const text = `${title} ${subtitle} ${body}`.toLowerCase();
  const tags = [];

  const tagPatterns = {
    'ai': /\bai\b|artificial intelligence|machine learning|generative/i,
    'crypto': /crypto|bitcoin|nft|blockchain|defi|meme.?coin/i,
    'markets': /stock|market|trading|invest|wall street/i,
    'music': /music|concert|album|song|rapper|hip.?hop/i,
    'travel': /travel|national park|road trip|vacation|destination/i,
    'food': /restaurant|chef|cooking|food|recipe|cheese/i,
    'sports': /sport|football|basketball|baseball|nba|nfl|mlb|soccer|copa/i,
    'culture': /culture|museum|art\b|fashion|nostalgia/i,
    'business': /business|startup|entrepreneur|company|brand/i,
    'books': /book|author|literary|read|writing/i,
    'technology': /tech|software|app\b|platform|digital/i,
    'gambling': /gambling|betting|casino|poker|odds/i,
    'holiday': /holiday|gift|christmas|thanksgiving/i,
    'predictions': /predict|forecast|2021|2022|2023|2024|2025|2026/i,
    'personal-essay': /personal|story|memoir|experience|my /i,
    'humor': /joke|funny|comedy|laugh|humor/i,
  };

  for (const [tag, pattern] of Object.entries(tagPatterns)) {
    if (pattern.test(text)) tags.push(tag);
  }

  return tags.slice(0, 8);
}

function classifyEvergreen(title, subtitle, body, date) {
  const text = `${title} ${subtitle} ${body}`.toLowerCase();
  const postDate = new Date(date);
  const ageMonths = (Date.now() - postDate.getTime()) / (1000 * 60 * 60 * 24 * 30);

  // Strong evergreen signals
  if (/how to|guide|lesson|principle|framework|what I learned|tips|rules|mastery/i.test(text)) return 'evergreen';
  if (/national park|travel guide|restaurant|recipe|gift guide/i.test(text)) return 'evergreen';

  // Derivative candidates — interesting but dated
  if (/predict|2019|2020|2021|quarantine|pandemic|year.?end/i.test(text) && ageMonths > 12) return 'derivative-candidate';

  // Refresh needed — good topic, needs updating
  if (/market|invest|crypto|stock|trend|best of/i.test(text) && ageMonths > 18) return 'refresh-needed';

  // Recent enough to be relevant
  if (ageMonths < 6) return 'evergreen';

  return 'archive-only';
}

function assessMonetization(title, subtitle, body) {
  const text = `${title} ${subtitle} ${body}`.toLowerCase();
  if (/gift guide|product|buy|shop|recommend|review|book|chef|recipe|hotel|restaurant/i.test(text)) return 'high';
  if (/travel|style|food|brand|invest|startup|course/i.test(text)) return 'medium';
  if (/business|market|tech|tool/i.test(text)) return 'low';
  return 'none';
}

function assessDerivative(title, subtitle, body) {
  const text = `${title} ${subtitle} ${body}`.toLowerCase();
  if (/national park|travel|restaurant|invest|startup|how to|guide|mastery|lesson/i.test(text)) return 'high';
  if (/music|book|culture|trend|market|predict/i.test(text)) return 'medium';
  return 'low';
}

function assessRefreshPriority(evergreenClass, monetization, derivative) {
  if (evergreenClass === 'evergreen' && (monetization === 'high' || derivative === 'high')) return 'high';
  if (evergreenClass === 'refresh-needed') return 'medium';
  if (evergreenClass === 'derivative-candidate') return 'medium';
  return 'none';
}

// --- Process each published post ---
let imported = 0;
let skipped = 0;

for (const post of posts) {
  if (post.is_published !== 'true') {
    skipped++;
    continue;
  }

  const postId = post.post_id;
  if (!postId) { skipped++; continue; }

  // Find the HTML file
  const htmlFile = path.join(archiveDir, 'posts', `${postId}.html`);
  if (!fs.existsSync(htmlFile)) {
    console.warn(`  SKIP: No HTML file for ${postId}`);
    skipped++;
    continue;
  }

  const htmlRaw = fs.readFileSync(htmlFile, 'utf-8');
  const body = htmlToMarkdown(htmlRaw);
  const wordCount = body.split(/\s+/).length;
  const imageCount = (htmlRaw.match(/<img /gi) || []).length;

  const title = (post.title || '').replace(/"/g, '\\"');
  const subtitle = (post.subtitle || '').replace(/"/g, '\\"');
  const date = post.post_date ? new Date(post.post_date).toISOString().split('T')[0] : '2020-01-01';

  // Auto-classify
  const pillar = classifyPillar(title, subtitle, body);
  const tags = extractTags(title, subtitle, body);
  const evergreenClass = classifyEvergreen(title, subtitle, body, post.post_date || '2020-01-01');
  const monetization = assessMonetization(title, subtitle, body);
  const derivative = assessDerivative(title, subtitle, body);
  const refreshPriority = assessRefreshPriority(evergreenClass, monetization, derivative);

  // Generate slug
  const slug = postId.replace(/^\d+\./, '').replace(/[^a-z0-9-]/gi, '-').toLowerCase().replace(/-+/g, '-').replace(/^-|-$/g, '');
  if (!slug || slug.length < 3) {
    console.warn(`  SKIP: Bad slug for ${postId}`);
    skipped++;
    continue;
  }

  // Build excerpt from first 200 chars of body
  const excerpt = (subtitle || body.slice(0, 200).replace(/\n/g, ' ').replace(/[#*\[\]]/g, '')).trim();

  // Build frontmatter
  const frontmatter = `---
title: "${title}"
originalDate: "${date}"
excerpt: "${excerpt.replace(/"/g, '\\"')}"
source: "substack"
sourceUrl: "https://ratlinks.substack.com/p/${slug}"
postId: "${postId}"
subtitle: "${subtitle}"
pillar: "${pillar}"
tags: [${tags.map(t => `"${t}"`).join(', ')}]
evergreenClass: "${evergreenClass}"
refreshPriority: "${refreshPriority}"
monetizationPotential: "${monetization}"
derivativePotential: "${derivative}"
reactivated: false
type: "${post.type || 'newsletter'}"
audience: "${post.audience || 'everyone'}"
emailSentAt: "${post.email_sent_at || ''}"
wordCount: ${wordCount}
hasImages: ${imageCount > 0}
imageCount: ${imageCount}
---`;

  const outputFile = path.join(outputDir, `${slug}.md`);
  fs.writeFileSync(outputFile, `${frontmatter}\n\n${body}`);
  imported++;
  console.log(`  OK: ${slug} (${pillar}, ${evergreenClass}, ${wordCount}w)`);
}

console.log(`\nDone! Imported: ${imported}, Skipped: ${skipped}`);
