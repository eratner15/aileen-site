#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const archiveDir = path.join(__dirname, '..', 'src', 'content', 'archive');
const postsDir = path.join(__dirname, '..', 'src', 'content', 'posts');

function parseFM(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  return m[1];
}

function extractField(fm, field) {
  const re = new RegExp('^' + field + ':\\s*(.+)$', 'm');
  const m = fm.match(re);
  return m ? m[1].trim().replace(/^"|"$/g, '') : null;
}

const archiveFiles = fs.readdirSync(archiveDir).filter(f => f.endsWith('.md'));
let merged = 0;

for (const file of archiveFiles) {
  const archiveContent = fs.readFileSync(path.join(archiveDir, file), 'utf8');
  const archiveFM = parseFM(archiveContent);
  if (!archiveFM) continue;

  const pillar = extractField(archiveFM, 'pillar') || 'business';
  const postPath = path.join(postsDir, pillar, file);

  if (!fs.existsSync(postPath)) continue;

  let postContent = fs.readFileSync(postPath, 'utf8');
  const postFMMatch = postContent.match(/^---\n([\s\S]*?)\n---/);
  if (!postFMMatch) continue;

  let postFM = postFMMatch[1];

  const fieldsToAdd = {
    source: extractField(archiveFM, 'source') || 'substack',
    originalDate: extractField(archiveFM, 'originalDate'),
    evergreenClass: extractField(archiveFM, 'evergreenClass'),
    refreshPriority: extractField(archiveFM, 'refreshPriority'),
    monetizationPotential: extractField(archiveFM, 'monetizationPotential'),
    derivativePotential: extractField(archiveFM, 'derivativePotential'),
  };

  let changed = false;
  for (const [key, val] of Object.entries(fieldsToAdd)) {
    if (!val || val === 'none' || val === 'archive-only') continue;
    const exists = new RegExp('^' + key + ':', 'm').test(postFM);
    if (!exists) {
      const quotedVal = /^(true|false|\d+)$/.test(val) ? val : '"' + val + '"';
      postFM += '\n' + key + ': ' + quotedVal;
      changed = true;
    }
  }

  // Add tags from archive
  const archiveTags = archiveFM.match(/^tags:\s*\[(.+)\]$/m);
  const postHasTags = /^tags:/m.test(postFM);
  if (archiveTags && !postHasTags) {
    postFM += '\ntags: [' + archiveTags[1] + ']';
    changed = true;
  }

  if (changed) {
    const body = postContent.slice(postFMMatch[0].length);
    fs.writeFileSync(postPath, '---\n' + postFM + '\n---' + body);
    merged++;
  }
}

console.log(`Merged archive metadata into ${merged} posts`);
