# Unsplash API Integration Documentation

## Overview

Complete Unsplash API integration for the "Sinónimos de Ver" application, providing contextual, high-quality images for each Spanish synonym of "ver" (to see).

## Architecture

### Core Components

1. **UnsplashService** (`src/scripts/services/unsplash.js`)
   - Main service class handling all Unsplash API interactions
   - Singleton pattern for consistent state management
   - Automatic rate limiting and request queuing

2. **Image Helpers** (`src/scripts/utils/imageHelpers.js`)
   - Utility functions for image rendering and manipulation
   - Loading states, error handling, and progressive loading

3. **Configuration** (`src/config/unsplash.config.js`)
   - Centralized configuration for API settings
   - Contextual search terms for each synonym
   - Cache and rate limit settings

4. **Styles** (`src/styles/images.css`)
   - Complete styling for all image states
   - Responsive design and accessibility features

## API Service Features

### 1. Image Search

```javascript
import unsplashService from './scripts/services/unsplash.js';

// Search for images by keyword
const results = await unsplashService.searchPhotos('nature landscape', {
  perPage: 10,
  orientation: 'landscape'
});

// Get image for specific synonym
const imageData = await unsplashService.getImageForSynonym('observar');
```

### 2. Caching Strategy

- **LocalStorage Cache**: Persistent cache across sessions
- **TTL**: 1 hour default (configurable)
- **Size Limit**: 50 items maximum (LRU eviction)
- **Automatic Cleanup**: Removes expired entries on load

```javascript
// Get cache statistics
const stats = unsplashService.getCacheStats();
console.log(`Cache size: ${stats.size}/${stats.maxSize}`);
console.log(`API calls remaining: ${stats.rateLimitRemaining}`);

// Clear cache manually
unsplashService.clearCache();
```

### 3. Rate Limiting

- **Limit**: 50 requests per hour (Unsplash demo app limit)
- **Request Queue**: Automatic queuing when rate limit approached
- **Delay**: 100ms between requests to prevent bursting
- **Graceful Degradation**: Falls back to cached/placeholder images

### 4. Error Handling

```javascript
// Automatic fallback to gradient placeholders
const imageData = await unsplashService.getImageForSynonym('vislumbrar');

if (imageData.isFallback) {
  // Using gradient placeholder due to API error
  console.log('Using fallback:', imageData.color);
} else {
  // Successfully retrieved from Unsplash
  console.log('Image URL:', imageData.url);
}
```

## Image Helper Utilities

### Creating Image Elements

```javascript
import { createImageElement } from './scripts/utils/imageHelpers.js';

const imageData = await unsplashService.getImageForSynonym('contemplar');

const imageEl = createImageElement(imageData, {
  lazy: true,              // Enable lazy loading
  progressive: true,       // Load thumbnail first
  showAttribution: true,   // Show Unsplash attribution
  onLoad: (img) => {
    console.log('Image loaded');
  },
  onError: (error) => {
    console.error('Image failed:', error);
  }
});

document.querySelector('#container').appendChild(imageEl);
```

### Lazy Loading

```javascript
import { lazyLoadImage, createLoadingPlaceholder } from './scripts/utils/imageHelpers.js';

const placeholder = createLoadingPlaceholder({ text: 'Loading image...' });
container.appendChild(placeholder);

lazyLoadImage(container, async () => {
  const imageData = await unsplashService.getImageForSynonym('divisar');
  const imageEl = createImageElement(imageData);
  container.replaceChild(imageEl, placeholder);
});
```

### Preloading

```javascript
// Preload next synonym image
await unsplashService.preloadNextSynonym('vislumbrar');

// Batch preload multiple images
import { batchPreloadImages } from './scripts/utils/imageHelpers.js';

const urls = [
  imageData1.url,
  imageData2.url,
  imageData3.url
];

await batchPreloadImages(urls);
```

## Configuration

### Search Term Mappings

Each synonym has a carefully crafted search term for contextually relevant images:

```javascript
// From unsplash.config.js
synonymSearchTerms: {
  'observar': 'person observing nature wildlife contemplation',
  'contemplar': 'meditation contemplation peaceful nature',
  'divisar': 'distant horizon landscape mountains vista',
  'vislumbrar': 'glimpse fog mist mysterious light',
  // ... 50+ more mappings
}
```

### Customizing Configuration

```javascript
import { UNSPLASH_CONFIG } from './config/unsplash.config.js';

// Adjust cache TTL
UNSPLASH_CONFIG.cache.ttl = 7200000; // 2 hours

// Change image quality
UNSPLASH_CONFIG.imageQuality.default = 'full'; // High resolution

// Modify dimensions
UNSPLASH_CONFIG.dimensions.width = 1920;
UNSPLASH_CONFIG.dimensions.height = 1080;
```

## Usage Examples

### Basic Implementation

```javascript
import unsplashService from './scripts/services/unsplash.js';
import { createImageElement } from './scripts/utils/imageHelpers.js';

async function displaySynonymImage(synonym) {
  const container = document.querySelector('#image-container');

  try {
    // Get image for synonym
    const imageData = await unsplashService.getImageForSynonym(synonym);

    // Create and append image element
    const imageEl = createImageElement(imageData, {
      progressive: true,
      lazy: false,
      showAttribution: true
    });

    container.innerHTML = '';
    container.appendChild(imageEl);

    // Preload next synonym
    const nextSynonym = getNextSynonym(synonym);
    if (nextSynonym) {
      unsplashService.preloadNextSynonym(nextSynonym);
    }
  } catch (error) {
    console.error('Failed to display image:', error);
  }
}
```

### Image Grid

```javascript
import { createImageGrid } from './scripts/utils/imageHelpers.js';

async function displaySynonymGrid(synonyms) {
  const imageDataArray = await Promise.all(
    synonyms.map(syn => unsplashService.getImageForSynonym(syn))
  );

  const grid = createImageGrid(imageDataArray, {
    columns: 3,
    showAttribution: true
  });

  document.querySelector('#grid-container').appendChild(grid);
}
```

### Progressive Enhancement

```javascript
import { applyBlurUpEffect } from './scripts/utils/imageHelpers.js';

async function displayWithBlurUp(synonym) {
  const imageData = await unsplashService.getImageForSynonym(synonym);

  const img = document.createElement('img');
  img.alt = imageData.altText;
  img.dataset.src = imageData.url;

  applyBlurUpEffect(img, imageData.thumbnailUrl);

  document.querySelector('#container').appendChild(img);
}
```

## Best Practices

### 1. Always Handle Errors

```javascript
try {
  const imageData = await unsplashService.getImageForSynonym(synonym);
  // Use imageData
} catch (error) {
  // Fallback handled automatically
  console.warn('Using fallback image');
}
```

### 2. Trigger Download Tracking

The service automatically triggers Unsplash's download tracking endpoint (required by API guidelines) when images are retrieved.

### 3. Respect Attribution

Always show attribution when displaying images:

```javascript
const imageEl = createImageElement(imageData, {
  showAttribution: true  // Required by Unsplash API guidelines
});
```

### 4. Use Caching Effectively

```javascript
// Check cache before making API calls
const cacheStats = unsplashService.getCacheStats();
if (cacheStats.rateLimitRemaining < 10) {
  console.warn('Approaching rate limit, relying on cache');
}
```

### 5. Preload for Better UX

```javascript
// Preload next image in sequence
function onSynonymChange(currentSynonym, nextSynonym) {
  displayImage(currentSynonym);

  if (nextSynonym) {
    unsplashService.preloadNextSynonym(nextSynonym);
  }
}
```

## API Response Structure

### Image Data Object

```javascript
{
  url: "https://images.unsplash.com/photo-...",
  thumbnailUrl: "https://images.unsplash.com/photo-...",
  attribution: {
    text: "Photo by John Doe on Unsplash",
    link: "https://unsplash.com/@johndoe...",
    photographer: "John Doe",
    photographerUrl: "https://unsplash.com/@johndoe"
  },
  altText: "Beautiful landscape with mountains",
  color: "#4A90E2",
  photoId: "abc123xyz",
  isFallback: false
}
```

### Fallback Object

```javascript
{
  url: null,
  thumbnailUrl: null,
  attribution: null,
  altText: "contemplar",
  color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  isFallback: true
}
```

## Rate Limit Management

### Current Limits

- **Demo App**: 50 requests/hour
- **Production**: 5,000 requests/hour (requires approval)

### Monitoring

```javascript
const stats = unsplashService.getCacheStats();
console.log(`Requests used: ${stats.requestCount}/${stats.rateLimitRemaining + stats.requestCount}`);
```

### Handling Rate Limits

The service automatically:
1. Queues requests when approaching limit
2. Returns cached results when available
3. Falls back to gradient placeholders when exhausted

## Troubleshooting

### Common Issues

**Images not loading:**
- Check browser console for API errors
- Verify API key is valid
- Check network connectivity
- Ensure cache hasn't expired

**Rate limit errors:**
- Clear cache to force fresh requests
- Wait for rate limit reset (1 hour)
- Check cache statistics

**Attribution not showing:**
- Ensure `showAttribution: true` in options
- Check CSS styles are loaded
- Verify image container has proper positioning

### Debug Mode

```javascript
// Enable verbose logging
unsplashService.debug = true;

// View cache contents
console.log('Cache:', Array.from(unsplashService.cache.entries()));
```

## Performance Optimization

### 1. Lazy Loading

```javascript
const imageEl = createImageElement(imageData, { lazy: true });
```

### 2. Progressive Loading

```javascript
const imageEl = createImageElement(imageData, { progressive: true });
```

### 3. Responsive Images

```javascript
import { getResponsiveSources } from './scripts/utils/imageHelpers.js';

const sources = getResponsiveSources(imageData);
// Use sources.small for mobile, sources.large for desktop
```

### 4. Batch Operations

```javascript
// Preload multiple images at once
const synonyms = ['ver', 'observar', 'contemplar'];
const images = await Promise.all(
  synonyms.map(s => unsplashService.getImageForSynonym(s))
);
```

## Browser Compatibility

- Modern browsers with ES6 modules support
- Fetch API required
- IntersectionObserver for lazy loading
- LocalStorage for caching

## Security Considerations

- API key exposed in frontend (demo key only)
- For production, proxy through backend
- Rate limiting prevents abuse
- No sensitive data stored in cache

## Future Enhancements

- Backend proxy for API key security
- Advanced caching strategies (IndexedDB)
- Image CDN integration
- A/B testing for search terms
- User preferences for image styles
- Offline support with Service Workers

## License & Attribution

This integration follows Unsplash API Guidelines:
- Attribution required for all images
- Download tracking triggered automatically
- Proper UTM parameters included
- Cache respects Unsplash policies
