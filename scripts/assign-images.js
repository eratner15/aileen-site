#!/usr/bin/env node
/**
 * Assign unique, content-relevant Unsplash images to each post
 * based on title, excerpt, and keyword analysis.
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const POSTS_DIR = './src/content/posts';

// Large pool of Unsplash images organized by topic
// Each array has unique images so no two posts in the same topic get the same one
const imagePool = {
  ai: [
    'photo-1677442136019-21780ecad995', // AI brain
    'photo-1620712943543-bcc4688e7485', // robot
    'photo-1655720828018-edd2daec9349', // circuit board
    'photo-1485827404703-89b55fcc595e', // robot face
    'photo-1531746790095-e5995ed7bdbe', // neural network
    'photo-1555255707-c07966088b7b', // tech abstract
    'photo-1507146153580-69a1fe6d8aa1', // data visualization
    'photo-1526374965328-7f61d4dc18c5', // matrix code
    'photo-1558494949-ef010cbdcc31', // server room
    'photo-1504639725590-34d0984388bd', // code on screen
  ],
  crypto: [
    'photo-1621761191319-c6fb62004040', // bitcoin
    'photo-1639762681485-074b7f938ba0', // crypto chart
    'photo-1622630998477-20aa696ecb05', // ethereum
    'photo-1516245834210-c4c142787335', // blockchain
    'photo-1642790106117-e829e14a795f', // crypto coins
    'photo-1518546305927-5a555bb7020d', // gold coins
    'photo-1611974789855-9c2a0a7236a3', // trading chart
    'photo-1605792657660-596af9009e82', // crypto mining
    'photo-1559526324-593bc073d938', // digital currency
    'photo-1634704784915-aacf363b021f', // NFT art
  ],
  markets: [
    'photo-1590283603385-17ffb3a7f29f', // stock chart
    'photo-1611974789855-9c2a0a7236a3', // trading floor
    'photo-1535320903710-d946a44237cc', // wall street
    'photo-1468254095679-bbcba94a7066', // bull statue
    'photo-1642543492481-44e81e3914a7', // market screen
    'photo-1559526324-4b87b5e36e44', // financial district
    'photo-1454165804606-c3d57bc86b40', // business meeting
    'photo-1460925895917-afdab827c52f', // stock ticker
    'photo-1504868584819-f8e8b4b6d7e3', // city skyline finance
    'photo-1444653614773-995cb1ef9efa', // newspaper financial
  ],
  music: [
    'photo-1511671782779-c97d3d27a1d4', // concert
    'photo-1514320291840-2e0a9bf2a9ae', // guitar
    'photo-1493225457124-a3eb161ffa5f', // crowd at concert
    'photo-1459749411175-04bf5292ceea', // stage lights
    'photo-1507838153414-b4b713384a76', // vinyl records
    'photo-1470225620780-dba8ba36b745', // DJ
    'photo-1508700115892-45ecd05ae2ad', // headphones
    'photo-1415201364774-f6f0bb35f28f', // piano
    'photo-1571330735066-03aaa9429d89', // studio
    'photo-1485579149621-3123dd979885', // microphone
  ],
  sports: [
    'photo-1461896836934-bd45ba8bab1d', // stadium
    'photo-1579952363873-27f3bade9f55', // basketball
    'photo-1508098682722-e99c43a406b2', // football
    'photo-1574629810360-7efbbe195018', // soccer
    'photo-1587280501635-68a0e82cd5ff', // boxing
    'photo-1521412644187-c49fa049e84d', // running
    'photo-1551958219-acbc608c6377', // baseball
    'photo-1530549387789-4c1017266635', // swimming
    'photo-1517649763962-0c623066013b', // cycling
    'photo-1546519638-68e109498ffc', // tennis
  ],
  culture: [
    'photo-1533669955142-6a73332af4db', // art gallery
    'photo-1531243269054-5ebf6f34081e', // museum
    'photo-1513364776144-60967b0f800f', // painting
    'photo-1506157786151-b8491531f063', // books
    'photo-1492684223f02-aead18e4235c', // film
    'photo-1478720568477-152d9b164e26', // cinema
    'photo-1524995997946-a1c2e315a42f', // theater
    'photo-1460881680858-30d872d5b530', // architecture
    'photo-1508739773434-c26b3d09e071', // sunset cityscape
    'photo-1499781350541-7783f6c6a0c8', // street art
  ],
  food: [
    'photo-1504674900247-0877df9cc836', // gourmet food
    'photo-1414235077428-338989a2e8c0', // fine dining
    'photo-1476224203421-9ac39bcb3327', // cooking
    'photo-1567620905732-2d1ec7ab7445', // food plating
    'photo-1555939594-58d7cb561ad1', // restaurant table
    'photo-1546069901-ba9599a7e63c', // chef cooking
    'photo-1495521821757-a1efb6729352', // bakery
    'photo-1484723091739-30a097e8f929', // dessert
    'photo-1551218808-94e220e084d2', // sushi
    'photo-1565299624946-b28f40a0ae38', // pizza
  ],
  travel: [
    'photo-1488646953014-85cb44e25828', // travel map
    'photo-1436491865332-7a61a109db05', // airplane window
    'photo-1469854523086-cc02fe5d8800', // road trip
    'photo-1507525428034-b723cf961d3e', // beach
    'photo-1476514525535-07fb3b4ae5f1', // mountain lake
    'photo-1530789253388-582c481c54b0', // city travel
    'photo-1501785888041-af3ef285b470', // landscape
    'photo-1500835556837-99ac94a94552', // airplane
    'photo-1473163928189-364b2c4e1135', // compass
    'photo-1528127269322-539801943592', // backpacker
  ],
  business: [
    'photo-1486406146926-c627a92ad1ab', // skyscraper
    'photo-1497366216548-37526070297c', // office
    'photo-1507003211169-0a1dd7228f2d', // entrepreneur
    'photo-1556761175-5973dc0f32e7', // team meeting
    'photo-1573164713988-8665fc963095', // strategy
    'photo-1553877522-43269d4ea984', // startup
    'photo-1542744173-8e7e53415bb0', // presentation
    'photo-1560472355-536de3962603', // workspace
    'photo-1521791136064-7986c2920216', // handshake
    'photo-1444653614773-995cb1ef9efa', // newspaper
  ],
  entertainment: [
    'photo-1489599849927-2ee91cede3ba', // movie theater
    'photo-1536440136628-849c177e76a1', // TV screen
    'photo-1585647347483-22b66260dfff', // gaming
    'photo-1594909122845-11baa439b7bf', // popcorn
    'photo-1440404653325-ab127d49abc1', // film reel
    'photo-1578662996442-48f60103fc96', // streaming
    'photo-1518929458119-e5bf444a6f0d', // comedy
    'photo-1603190287605-e6ade32fa852', // awards
    'photo-1485846234645-a62644f84728', // cinema seats
    'photo-1542204165-65bf26472b9b', // Netflix
  ],
  lifestyle: [
    'photo-1506126613408-eca07ce68773', // meditation
    'photo-1522771739844-6a9f6d5f14af', // home interior
    'photo-1513542789411-b6a5d4f31634', // reading
    'photo-1484101403633-562f891dc89a', // coffee
    'photo-1507652313519-d4e9174996dd', // wellness
    'photo-1519389950473-47ba0277781c', // workspace
    'photo-1494438639946-1ebd1d20bf85', // nature walk
    'photo-1545205597-3d9d02c29597', // yoga
    'photo-1493723843671-1d655e66ac1c', // journal
    'photo-1558618666-fcd25c85f82e', // minimalist
  ],
  finance: [
    'photo-1611974789855-9c2a0a7236a3', // trading
    'photo-1454165804606-c3d57bc86b40', // finance meeting
    'photo-1460925895917-afdab827c52f', // stock numbers
    'photo-1579621970563-ebec7560ff3e', // calculator
    'photo-1553729459-afe8f2e2ed65', // charts
    'photo-1526304640581-d334cdbbf45e', // money
    'photo-1565373677928-90e963765fdc', // bank
    'photo-1434626881859-194d67b2b86f', // city financial
    'photo-1551288049-bebda4e38f71', // dashboard
    'photo-1462206092226-f46025ffe607', // coins
  ],
  tech: [
    'photo-1518770660439-4636190af475', // circuit board
    'photo-1550751827-4bd374c3f58b', // tech abstract
    'photo-1488590528505-98d2b5aba04b', // laptop code
    'photo-1519389950473-47ba0277781c', // tech workspace
    'photo-1535223289827-42f1e9919769', // VR
    'photo-1451187580459-43490279c0fa', // earth tech
    'photo-1498050108023-c5249f4df085', // coding
    'photo-1573164713714-d95e436ab8d6', // smartphone
    'photo-1581091226825-a6a2a5aee158', // tech innovation
    'photo-1550745165-9bc0b252726f', // tech devices
  ],
  predictions: [
    'photo-1504639725590-34d0984388bd', // crystal ball feel
    'photo-1507003211169-0a1dd7228f2d', // thinking
    'photo-1451187580459-43490279c0fa', // futuristic
    'photo-1534972195531-d756b9bfa9f2', // telescope
    'photo-1533073526757-2c8ca1df9f1c', // horizon
  ],
  books: [
    'photo-1506157786151-b8491531f063', // stack of books
    'photo-1512820790803-83ca734da794', // library
    'photo-1544716278-ca5e3f4abd8c', // open book
    'photo-1495446815901-a7297e633e8d', // bookshelf
    'photo-1457369804613-52c61a468e7d', // reading
  ],
  holiday: [
    'photo-1482517967863-00e15c9b44be', // holiday lights
    'photo-1512389142860-9c449e58a814', // winter
    'photo-1544982503-9f984c14501a', // gifts
    'photo-1576919228236-a097c32a5cd4', // celebration
    'photo-1514315384763-ba401779410f', // fireworks
  ],
  real_estate: [
    'photo-1560518883-ce09059eeffa', // house
    'photo-1582407947304-fd86f028f716', // real estate
    'photo-1600585154340-be6161a56a0c', // modern home
    'photo-1600596542815-ffad4c1539a9', // luxury home
    'photo-1600607687939-ce8a6c25118c', // apartment
  ],
};

// Track used images to avoid duplicates
const usedImages = new Set();

function pickImage(title, keyword, pillar, excerpt) {
  const text = `${title} ${keyword} ${excerpt}`.toLowerCase();

  // Score each topic pool
  const scores = {};
  const topicKeywords = {
    ai: ['ai', 'artificial intelligence', 'generative', 'chatgpt', 'machine learning', 'automated', 'robot', 'algorithm'],
    crypto: ['crypto', 'bitcoin', 'ethereum', 'nft', 'blockchain', 'defi', 'web3', 'token', 'fungible'],
    markets: ['stock', 'market', 'trading', 'wall street', 'investor', 'bull', 'bear', 'rally', 'index', 'dow', 's&p', 'nasdaq', 'ipo', 'spac', 'meme stock'],
    music: ['music', 'song', 'album', 'concert', 'rapper', 'hip hop', 'rock', 'band', 'vinyl', 'spotify', 'dj', 'playlist'],
    sports: ['sport', 'nba', 'nfl', 'mlb', 'game', 'player', 'team', 'championship', 'super bowl', 'betting', 'fantasy', 'draft', 'coach', 'athlete', 'boxing', 'ufc'],
    food: ['food', 'restaurant', 'chef', 'recipe', 'cooking', 'eat', 'dinner', 'kitchen', 'cuisine', 'wine', 'cocktail', 'brunch'],
    travel: ['travel', 'trip', 'destination', 'hotel', 'flight', 'vacation', 'boat', 'island', 'national park', 'beach'],
    culture: ['art', 'museum', 'movie', 'film', 'book', 'gallery', 'theater', 'culture', 'literary', 'painting', 'exhibit'],
    entertainment: ['tv', 'show', 'streaming', 'netflix', 'movie', 'comedy', 'awards', 'oscar', 'emmy', 'celebrity'],
    predictions: ['prediction', 'forecast', 'year ahead', '2020', '2021', '2022', '2023', '2024', '2025', '2026', 'new year', 'resolution'],
    books: ['book', 'read', 'author', 'novel', 'literary', 'library', 'writing', 'writer', 'bestseller'],
    holiday: ['holiday', 'christmas', 'thanksgiving', 'halloween', 'valentine', 'fourth of july', 'summer', 'winter', 'spring', 'celebration'],
    real_estate: ['real estate', 'housing', 'rent', 'mortgage', 'property', 'home', 'apartment', 'landlord'],
    finance: ['finance', 'money', 'invest', 'wealth', 'bank', 'interest rate', 'fed', 'inflation', 'economy', 'fiscal', 'tax'],
    tech: ['tech', 'startup', 'silicon valley', 'app', 'software', 'hardware', 'innovation', 'digital'],
    business: ['business', 'company', 'ceo', 'startup', 'deal', 'acquisition', 'revenue', 'growth', 'brand', 'corporate', 'entrepreneur'],
    lifestyle: ['lifestyle', 'wellness', 'mindful', 'intentional', 'routine', 'habit', 'balance'],
  };

  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    scores[topic] = 0;
    for (const kw of keywords) {
      if (text.includes(kw)) scores[topic] += (kw.length > 4 ? 2 : 1);
    }
  }

  // Sort topics by score
  const ranked = Object.entries(scores)
    .filter(([topic]) => imagePool[topic])
    .sort((a, b) => b[1] - a[1]);

  // Try top-scoring topic first, then fallback
  for (const [topic] of ranked) {
    if (scores[topic] === 0 && topic !== pillar) continue;
    const pool = imagePool[topic];
    for (const img of pool) {
      if (!usedImages.has(img)) {
        usedImages.add(img);
        return `https://images.unsplash.com/${img}?w=1200&h=675&fit=crop`;
      }
    }
  }

  // Fallback to pillar pool
  const fallbackPool = imagePool[pillar] || imagePool.business;
  for (const img of fallbackPool) {
    if (!usedImages.has(img)) {
      usedImages.add(img);
      return `https://images.unsplash.com/${img}?w=1200&h=675&fit=crop`;
    }
  }

  // Ultimate fallback - any unused image
  for (const pool of Object.values(imagePool)) {
    for (const img of pool) {
      if (!usedImages.has(img)) {
        usedImages.add(img);
        return `https://images.unsplash.com/${img}?w=1200&h=675&fit=crop`;
      }
    }
  }

  return `https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=675&fit=crop`;
}

// Process all posts
const pillars = readdirSync(POSTS_DIR).filter(d => {
  try { return readdirSync(join(POSTS_DIR, d)).some(f => f.endsWith('.md')); }
  catch { return false; }
});

let count = 0;
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

    // Extract fields
    const titleMatch = fm.match(/^title:\s*"(.*)"/m);
    const excerptMatch = fm.match(/^excerpt:\s*"(.*)"/m);
    const keywordMatch = fm.match(/^targetKeyword:\s*"(.*)"/m);
    const title = titleMatch ? titleMatch[1] : file;
    const excerpt = excerptMatch ? excerptMatch[1] : '';
    const keyword = keywordMatch ? keywordMatch[1] : '';

    const newImage = pickImage(title, keyword, pillar, excerpt + ' ' + body.slice(0, 500));

    // Replace image line
    const newFm = fm.replace(/^image:\s*".*"$/m, `image: "${newImage}"`);
    writeFileSync(path, `---\n${newFm}\n---\n${body}`);
    count++;
  }
}

console.log(`Updated images for ${count} posts.`);
console.log(`Used ${usedImages.size} unique images.`);
