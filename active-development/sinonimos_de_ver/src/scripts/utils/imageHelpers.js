/**
 * Image Helper Utilities
 * Utility functions for image handling, loading, and error states
 */

import unsplashService from '../services/unsplash.js';

/**
 * Create image element with loading and error handlers
 * @param {Object} imageData - Image data from Unsplash service
 * @param {Object} options - Configuration options
 * @returns {HTMLElement} - Image container element
 */
export function createImageElement(imageData, options = {}) {
  const container = document.createElement('div');
  container.className = 'image-container';

  // Apply loading state
  container.classList.add('loading');

  if (imageData.isFallback) {
    // Create fallback gradient element
    const fallback = document.createElement('div');
    fallback.className = 'image-fallback';
    fallback.style.background = imageData.color;

    const text = document.createElement('span');
    text.className = 'fallback-text';
    text.textContent = imageData.altText;
    fallback.appendChild(text);

    container.appendChild(fallback);
    container.classList.remove('loading');
    container.classList.add('fallback');
  } else {
    // Create actual image element
    const img = document.createElement('img');
    img.alt = imageData.altText;
    img.loading = options.lazy ? 'lazy' : 'eager';

    // Set placeholder color
    container.style.backgroundColor = imageData.color;

    // Handle load
    img.onload = () => {
      container.classList.remove('loading');
      container.classList.add('loaded');

      if (options.onLoad) {
        options.onLoad(img);
      }
    };

    // Handle error
    img.onerror = () => {
      console.warn('Image failed to load:', imageData.url);
      container.classList.remove('loading');
      container.classList.add('error');

      // Replace with fallback
      const fallback = createFallbackElement(imageData.altText, imageData.color);
      container.replaceChild(fallback, img);

      if (options.onError) {
        options.onError(new Error('Image load failed'));
      }
    };

    // Use thumbnail first, then high-res
    if (options.progressive && imageData.thumbnailUrl) {
      const thumbnail = new Image();
      thumbnail.onload = () => {
        img.src = imageData.url;
      };
      thumbnail.src = imageData.thumbnailUrl;
      img.src = imageData.thumbnailUrl;
      img.classList.add('thumbnail');
    } else {
      img.src = imageData.url;
    }

    container.appendChild(img);

    // Add attribution if present
    if (imageData.attribution && options.showAttribution !== false) {
      const attribution = createAttributionElement(imageData.attribution);
      container.appendChild(attribution);
    }
  }

  return container;
}

/**
 * Create fallback element
 * @param {string} text - Fallback text
 * @param {string} color - Background color/gradient
 * @returns {HTMLElement} - Fallback element
 */
function createFallbackElement(text, color) {
  const fallback = document.createElement('div');
  fallback.className = 'image-fallback';
  fallback.style.background = color;

  const textEl = document.createElement('span');
  textEl.className = 'fallback-text';
  textEl.textContent = text;
  fallback.appendChild(textEl);

  return fallback;
}

/**
 * Create attribution element
 * @param {Object} attribution - Attribution data
 * @returns {HTMLElement} - Attribution element
 */
function createAttributionElement(attribution) {
  const div = document.createElement('div');
  div.className = 'image-attribution';

  const link = document.createElement('a');
  link.href = attribution.link;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = attribution.text;

  div.appendChild(link);
  return div;
}

/**
 * Create loading placeholder
 * @param {Object} options - Placeholder options
 * @returns {HTMLElement} - Placeholder element
 */
export function createLoadingPlaceholder(options = {}) {
  const container = document.createElement('div');
  container.className = 'image-placeholder loading';

  const spinner = document.createElement('div');
  spinner.className = 'spinner';

  if (options.text) {
    const text = document.createElement('span');
    text.className = 'loading-text';
    text.textContent = options.text;
    container.appendChild(text);
  }

  container.appendChild(spinner);
  return container;
}

/**
 * Lazy load images when they enter viewport
 * @param {HTMLElement} element - Element to observe
 * @param {Function} loadCallback - Callback to load image
 * @returns {IntersectionObserver} - Observer instance
 */
export function lazyLoadImage(element, loadCallback) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadCallback();
        observer.unobserve(element);
      }
    });
  }, {
    rootMargin: '50px'
  });

  observer.observe(element);
  return observer;
}

/**
 * Batch preload images
 * @param {Array<string>} urls - Array of image URLs
 * @returns {Promise<Array>} - Array of load results
 */
export async function batchPreloadImages(urls) {
  const promises = urls.map(url => unsplashService.preloadImage(url).catch(err => {
    console.warn(`Failed to preload ${url}:`, err);
    return null;
  }));

  return Promise.allSettled(promises);
}

/**
 * Get responsive image sources
 * @param {Object} imageData - Image data
 * @returns {Object} - Responsive sources
 */
export function getResponsiveSources(imageData) {
  if (!imageData.url) return null;

  return {
    small: imageData.thumbnailUrl || imageData.url,
    medium: imageData.url,
    large: imageData.url
  };
}

/**
 * Handle image error with retry
 * @param {HTMLImageElement} img - Image element
 * @param {string} fallbackUrl - Fallback URL
 * @param {number} maxRetries - Maximum retry attempts
 */
export function handleImageErrorWithRetry(img, fallbackUrl, maxRetries = 3) {
  let retries = 0;

  img.onerror = () => {
    if (retries < maxRetries) {
      retries++;
      console.log(`Retrying image load (${retries}/${maxRetries})`);

      // Add cache-busting parameter
      const url = new URL(img.src);
      url.searchParams.set('retry', retries);
      img.src = url.toString();
    } else if (fallbackUrl) {
      console.warn('Max retries reached, using fallback');
      img.src = fallbackUrl;
    }
  };
}

/**
 * Apply blur-up effect
 * @param {HTMLImageElement} img - Image element
 * @param {string} thumbnailUrl - Thumbnail URL for blur effect
 */
export function applyBlurUpEffect(img, thumbnailUrl) {
  const thumbnail = new Image();
  thumbnail.className = 'blur-up-thumbnail';

  thumbnail.onload = () => {
    img.parentElement.insertBefore(thumbnail, img);
    thumbnail.style.filter = 'blur(10px)';

    img.onload = () => {
      thumbnail.style.opacity = '0';
      setTimeout(() => thumbnail.remove(), 300);
    };

    img.src = img.dataset.src;
  };

  thumbnail.src = thumbnailUrl;
}

/**
 * Create image grid
 * @param {Array<Object>} images - Array of image data
 * @param {Object} options - Grid options
 * @returns {HTMLElement} - Grid container
 */
export function createImageGrid(images, options = {}) {
  const grid = document.createElement('div');
  grid.className = 'image-grid';

  if (options.columns) {
    grid.style.gridTemplateColumns = `repeat(${options.columns}, 1fr)`;
  }

  images.forEach(imageData => {
    const imageEl = createImageElement(imageData, {
      lazy: true,
      progressive: true,
      showAttribution: options.showAttribution
    });
    grid.appendChild(imageEl);
  });

  return grid;
}

/**
 * Check if image URL is valid
 * @param {string} url - Image URL
 * @returns {Promise<boolean>} - True if valid
 */
export async function isImageUrlValid(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok && response.headers.get('content-type')?.startsWith('image/');
  } catch {
    return false;
  }
}

/**
 * Get dominant color from image
 * @param {string} url - Image URL
 * @returns {Promise<string>} - Dominant color as hex
 */
export async function getDominantColor(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 1;
      canvas.height = 1;

      ctx.drawImage(img, 0, 0, 1, 1);
      const pixel = ctx.getImageData(0, 0, 1, 1).data;

      const hex = '#' + [pixel[0], pixel[1], pixel[2]]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');

      resolve(hex);
    };

    img.onerror = reject;
    img.src = url;
  });
}

export default {
  createImageElement,
  createLoadingPlaceholder,
  lazyLoadImage,
  batchPreloadImages,
  getResponsiveSources,
  handleImageErrorWithRetry,
  applyBlurUpEffect,
  createImageGrid,
  isImageUrlValid,
  getDominantColor
};
