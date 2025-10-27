/**
 * Download Images from Unsplash for Sinónimos de Ver
 *
 * This script searches for and downloads contextually appropriate images
 * for each Spanish synonym of "ver"
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const UNSPLASH_ACCESS_KEY = 'DPM5yTFbvoZW0imPQWe5pAXAxbEMhhBZE1GllByUPzY';
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'assets', 'images', 'synonyms');
const HERO_DIR = path.join(__dirname, '..', 'src', 'assets', 'images', 'hero');

// Ensure output directories exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}
if (!fs.existsSync(HERO_DIR)) {
  fs.mkdirSync(HERO_DIR, { recursive: true });
}

// Contextual search terms for each synonym (from our research)
const SYNONYM_IMAGES = {
  // Hero image
  hero: {
    query: 'spanish colonial architecture sunset',
    filename: 'hero.jpg',
    dir: HERO_DIR
  },

  // Synonyms
  observar: {
    query: 'person observing nature wildlife binoculars',
    filename: 'observar.jpg'
  },
  contemplar: {
    query: 'person meditating contemplation peaceful',
    filename: 'contemplar.jpg'
  },
  divisar: {
    query: 'distant mountain horizon landscape vista',
    filename: 'divisar.jpg'
  },
  avistar: {
    query: 'whale watching spotting distant',
    filename: 'avistar.jpg'
  },
  otear: {
    query: 'lookout tower scanning horizon surveillance',
    filename: 'otear.jpg'
  },
  percibir: {
    query: 'sensory perception consciousness awareness',
    filename: 'percibir.jpg'
  },
  notar: {
    query: 'person noticing detail attention observant',
    filename: 'notar.jpg'
  },
  advertir: {
    query: 'warning sign caution notice alert',
    filename: 'advertir.jpg'
  },
  constatar: {
    query: 'verification evidence confirmation proof',
    filename: 'constatar.jpg'
  },
  vislumbrar: {
    query: 'glimpse through fog misty faint light',
    filename: 'vislumbrar.jpg'
  },
  atisbar: {
    query: 'peeking through window glimpse spy',
    filename: 'atisbar.jpg'
  },
  entrever: {
    query: 'partial view obscured glimpse shadows',
    filename: 'entrever.jpg'
  },
  acechar: {
    query: 'stalking lurking surveillance watching secretly',
    filename: 'acechar.jpg'
  },
  columbrar: {
    query: 'distant lighthouse beacon faint light discern',
    filename: 'columbrar.jpg'
  }
};

// Sleep helper
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Search Unsplash and get best image
async function searchUnsplash(query) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.unsplash.com',
      path: `/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.results && json.results.length > 0) {
            resolve(json.results[0]);
          } else {
            reject(new Error(`No results for query: ${query}`));
          }
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

// Download image from URL
async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

// Main function
async function downloadAllImages() {
  const metadata = {
    images: {},
    downloadedAt: new Date().toISOString(),
    attribution: 'Photos from Unsplash (https://unsplash.com)'
  };

  console.log('🎨 Starting image download for Sinónimos de Ver...\n');

  for (const [synonym, config] of Object.entries(SYNONYM_IMAGES)) {
    try {
      console.log(`🔍 Searching for: ${synonym} (${config.query})...`);

      // Search Unsplash
      const photo = await searchUnsplash(config.query);

      // Get high-quality URL
      const imageUrl = photo.urls.regular; // 1080px width
      const outputPath = path.join(config.dir || OUTPUT_DIR, config.filename);

      console.log(`📥 Downloading from: ${photo.user.name}...`);

      // Download image
      await downloadImage(imageUrl, outputPath);

      // Store metadata
      metadata.images[synonym] = {
        filename: config.filename,
        photographer: photo.user.name,
        photographerUrl: photo.user.links.html,
        unsplashUrl: photo.links.html,
        description: photo.description || photo.alt_description,
        color: photo.color,
        width: photo.width,
        height: photo.height
      };

      console.log(`✅ Downloaded: ${config.filename}\n`);

      // Rate limiting - be nice to Unsplash API
      await sleep(1000);

    } catch (err) {
      console.error(`❌ Error downloading ${synonym}: ${err.message}\n`);
      metadata.images[synonym] = {
        error: err.message,
        filename: config.filename
      };
    }
  }

  // Save metadata
  const metadataPath = path.join(__dirname, '..', 'src', 'data', 'image_credits.json');
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

  console.log('📝 Metadata saved to: src/data/image_credits.json');
  console.log('\n✨ Image download complete!');
  console.log(`📊 Downloaded ${Object.keys(metadata.images).filter(k => !metadata.images[k].error).length}/${Object.keys(SYNONYM_IMAGES).length} images`);
}

// Run
downloadAllImages().catch(console.error);
