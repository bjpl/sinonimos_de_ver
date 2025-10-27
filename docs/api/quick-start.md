# Unsplash Integration Quick Start Guide

## Installation

The Unsplash integration is ready to use. No additional dependencies required - it uses native browser APIs (Fetch, LocalStorage, IntersectionObserver).

## File Structure

```
sinonimos_de_ver/
├── src/
│   ├── config/
│   │   └── unsplash.config.js          # Configuration (API key, search terms)
│   ├── scripts/
│   │   ├── services/
│   │   │   └── unsplash.js             # Main Unsplash service
│   │   ├── components/
│   │   │   └── SynonymImageCard.js     # Ready-to-use card component
│   │   └── utils/
│   │       ├── imageHelpers.js         # Image utility functions
│   │       └── synonymData.js          # Synonym data management
│   └── styles/
│       └── images.css                   # Complete image styling
├── tests/
│   └── unsplash-integration.test.html   # Interactive test page
└── docs/
    └── api/
        ├── unsplash-integration.md      # Complete documentation
        └── quick-start.md               # This file
```

## 5-Minute Quick Start

### 1. Include Required Files

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="src/styles/images.css">
</head>
<body>
  <div id="app"></div>

  <script type="module">
    import { createSynonymCard } from './src/scripts/components/SynonymImageCard.js';
    import { getSynonymByWord } from './src/scripts/utils/synonymData.js';

    // Your code here
  </script>
</body>
</html>
```

### 2. Display a Synonym with Image

```javascript
// Get synonym data
const synonymData = getSynonymByWord('observar');

// Create card
const card = await createSynonymCard(synonymData, {
  showDefinition: true,
  showExamples: true,
  showAttribution: true
});

// Add to page
document.getElementById('app').appendChild(card.element);
```

### 3. That's It!

The card will automatically:
- Fetch the appropriate image from Unsplash
- Show a loading state
- Handle errors gracefully (fallback to gradients)
- Display proper attribution
- Cache the result for 1 hour

## Common Use Cases

### Use Case 1: Simple Image Display

```javascript
import unsplashService from './src/scripts/services/unsplash.js';
import { createImageElement } from './src/scripts/utils/imageHelpers.js';

// Get image for synonym
const imageData = await unsplashService.getImageForSynonym('contemplar');

// Create image element
const imageEl = createImageElement(imageData, {
  progressive: true,
  showAttribution: true
});

// Add to page
document.querySelector('#container').appendChild(imageEl);
```

### Use Case 2: Synonym Navigator

```javascript
import { createSynonymCard } from './src/scripts/components/SynonymImageCard.js';
import { getSynonymByWord, getNextSynonym } from './src/scripts/utils/synonymData.js';

let currentWord = 'observar';
const card = await createSynonymCard(getSynonymByWord(currentWord));

document.getElementById('app').appendChild(card.element);

// Next button
document.getElementById('nextBtn').addEventListener('click', async () => {
  const next = getNextSynonym(currentWord);
  if (next) {
    await card.update(next);
    currentWord = next.word;
  }
});
```

### Use Case 3: Image Gallery

```javascript
import unsplashService from './src/scripts/services/unsplash.js';
import { createImageGrid } from './src/scripts/utils/imageHelpers.js';

// Get images for multiple synonyms
const synonyms = ['observar', 'contemplar', 'divisar', 'vislumbrar'];

const images = await Promise.all(
  synonyms.map(syn => unsplashService.getImageForSynonym(syn))
);

// Create grid
const grid = createImageGrid(images, {
  columns: 2,
  showAttribution: true
});

document.querySelector('#gallery').appendChild(grid);
```

## Testing

Open the test page in your browser:

```
file:///path/to/sinonimos_de_ver/tests/unsplash-integration.test.html
```

The test page allows you to:
- Test image loading for each synonym
- View cache statistics
- Refresh images (clear cache)
- See loading states and errors

## Configuration

### Change API Key

Edit `src/config/unsplash.config.js`:

```javascript
export const UNSPLASH_CONFIG = {
  accessKey: 'YOUR_NEW_API_KEY_HERE',
  // ... rest of config
};
```

### Customize Search Terms

Edit `src/config/unsplash.config.js`:

```javascript
synonymSearchTerms: {
  'observar': 'your custom search term here',
  // ... other synonyms
}
```

### Adjust Cache Settings

Edit `src/config/unsplash.config.js`:

```javascript
cache: {
  enabled: true,
  ttl: 7200000,  // 2 hours instead of 1
  maxSize: 100   // 100 items instead of 50
}
```

## Troubleshooting

### Images Not Loading

1. **Check console for errors**
   ```javascript
   // Enable verbose logging
   import unsplashService from './src/scripts/services/unsplash.js';
   console.log('Cache stats:', unsplashService.getCacheStats());
   ```

2. **Verify API key is valid**
   - Test at: https://api.unsplash.com/photos/random?client_id=YOUR_KEY

3. **Check rate limits**
   ```javascript
   const stats = unsplashService.getCacheStats();
   console.log('Remaining calls:', stats.rateLimitRemaining);
   ```

### CORS Errors

If you get CORS errors:
- Must run from a web server (not `file://`)
- Use Live Server extension in VS Code
- Or run: `npx http-server .`

### Cache Issues

Clear cache:
```javascript
import unsplashService from './src/scripts/services/unsplash.js';
unsplashService.clearCache();
```

## API Limits

**Demo API Key (Current):**
- 50 requests per hour
- Demo mode restrictions

**Production API Key:**
- Apply at: https://unsplash.com/oauth/applications
- 5,000 requests per hour
- No demo restrictions

## Best Practices

### 1. Always Handle Errors

```javascript
try {
  const imageData = await unsplashService.getImageForSynonym('observar');
  // Use imageData
} catch (error) {
  // Service automatically provides fallback
  console.warn('Using fallback image');
}
```

### 2. Preload Next Images

```javascript
const card = await createSynonymCard(synonymData, {
  preloadNext: true  // Automatically preloads next synonym
});
```

### 3. Use Progressive Loading

```javascript
const imageEl = createImageElement(imageData, {
  progressive: true,  // Loads thumbnail first, then full size
  lazy: true          // Only loads when visible
});
```

### 4. Monitor Cache

```javascript
// Check cache status regularly
const stats = unsplashService.getCacheStats();
if (stats.rateLimitRemaining < 10) {
  console.warn('Approaching rate limit!');
}
```

## Next Steps

1. **Read full documentation**: `docs/api/unsplash-integration.md`
2. **Test the integration**: `tests/unsplash-integration.test.html`
3. **Customize search terms**: `src/config/unsplash.config.js`
4. **Add more synonyms**: `src/scripts/utils/synonymData.js`

## Need Help?

- Check the full documentation: `docs/api/unsplash-integration.md`
- Review example code in: `tests/unsplash-integration.test.html`
- Inspect browser console for errors
- Verify API key and rate limits

## Example: Complete Mini App

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sinónimos de Ver</title>
  <link rel="stylesheet" href="src/styles/images.css">
  <style>
    body {
      font-family: sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      background: #f5f5f5;
    }
    .controls {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    button {
      padding: 0.75rem 1.5rem;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
    }
    button:hover {
      background: #5568d3;
    }
  </style>
</head>
<body>
  <h1>🔍 Sinónimos de Ver</h1>

  <div class="controls">
    <button id="prevBtn">← Anterior</button>
    <button id="nextBtn">Siguiente →</button>
  </div>

  <div id="app"></div>

  <script type="module">
    import { createSynonymCard } from './src/scripts/components/SynonymImageCard.js';
    import { getSynonymByWord, getNextSynonym, getPreviousSynonym } from './src/scripts/utils/synonymData.js';

    let currentWord = 'observar';
    let card = null;

    async function showSynonym(word) {
      const data = getSynonymByWord(word);
      if (!data) return;

      if (!card) {
        card = await createSynonymCard(data);
        document.getElementById('app').appendChild(card.element);
      } else {
        await card.update(data);
      }

      currentWord = word;
    }

    document.getElementById('nextBtn').addEventListener('click', async () => {
      const next = getNextSynonym(currentWord);
      if (next) await showSynonym(next.word);
    });

    document.getElementById('prevBtn').addEventListener('click', async () => {
      const prev = getPreviousSynonym(currentWord);
      if (prev) await showSynonym(prev.word);
    });

    // Initial load
    showSynonym(currentWord);
  </script>
</body>
</html>
```

Save this as `index.html` and open in your browser to see a working synonym navigator with Unsplash images!
