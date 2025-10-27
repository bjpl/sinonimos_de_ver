const https = require('https');
const fs = require('fs');
const path = require('path');

const UNSPLASH_ACCESS_KEY = 'DPM5yTFbvoZW0imPQWe5pAXAxbEMhhBZE1GllByUPzY';
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'assets', 'images', 'synonyms');

async function searchAndDownload(query, filename) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.unsplash.com',
      path: `/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      headers: { 'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}` }
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const json = JSON.parse(data);
        if (json.results && json.results.length > 0) {
          const photo = json.results[0];
          const file = fs.createWriteStream(path.join(OUTPUT_DIR, filename));
          https.get(photo.urls.regular, (response) => {
            response.pipe(file);
            file.on('finish', () => {
              file.close();
              console.log(`✅ Downloaded: ${filename} by ${photo.user.name}`);
              resolve(photo);
            });
          });
        } else {
          reject(new Error('No results'));
        }
      });
    }).on('error', reject);
  });
}

searchAndDownload('detective magnifying glass examining evidence', 'constatar.jpg')
  .catch(err => console.error('Error:', err.message));
