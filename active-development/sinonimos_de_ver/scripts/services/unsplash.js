/**
 * Unsplash API Service
 * Handles image search, retrieval, caching, and error handling
 */

import { UNSPLASH_CONFIG, ATTRIBUTION_TEMPLATE } from '../../config/unsplash.config.js';

/**
 * Unsplash Service Class
 * Manages all interactions with the Unsplash API
 */
class UnsplashService {
  constructor() {
    this.config = UNSPLASH_CONFIG;
    this.cache = new Map();
    this.requestCount = 0;
    this.lastRequestTime = Date.now();
    this.requestQueue = [];
    this.isProcessingQueue = false;
  }

  /**
   * Initialize the service
   */
  async initialize() {
    this.loadCacheFromStorage();
    this.startRateLimitReset();
  }

  /**
   * Load cached images from localStorage
   */
  loadCacheFromStorage() {
    if (!this.config.cache.enabled) return;

    try {
      const cached = localStorage.getItem('unsplash_cache');
      if (cached) {
        const data = JSON.parse(cached);

        // Filter out expired entries
        const now = Date.now();
        Object.entries(data).forEach(([key, value]) => {
          if (now - value.timestamp < this.config.cache.ttl) {
            this.cache.set(key, value);
          }
        });
      }
    } catch (error) {
      console.warn('Failed to load cache from storage:', error);
    }
  }

  /**
   * Save cache to localStorage
   */
  saveCacheToStorage() {
    if (!this.config.cache.enabled) return;

    try {
      const cacheObj = {};
      this.cache.forEach((value, key) => {
        cacheObj[key] = value;
      });

      // Limit cache size
      const entries = Object.entries(cacheObj);
      if (entries.length > this.config.cache.maxSize) {
        // Keep only the most recent entries
        const sorted = entries.sort((a, b) => b[1].timestamp - a[1].timestamp);
        const limited = sorted.slice(0, this.config.cache.maxSize);
        Object.fromEntries(limited);
      }

      localStorage.setItem('unsplash_cache', JSON.stringify(cacheObj));
    } catch (error) {
      console.warn('Failed to save cache to storage:', error);
    }
  }

  /**
   * Reset request count every hour
   */
  startRateLimitReset() {
    setInterval(() => {
      this.requestCount = 0;
    }, 3600000); // 1 hour
  }

  /**
   * Check if rate limit is exceeded
   */
  isRateLimited() {
    return this.requestCount >= this.config.rateLimit.requestsPerHour;
  }

  /**
   * Wait for rate limit delay
   */
  async waitForRateLimit() {
    const timeSinceLastRequest = Date.now() - this.lastRequestTime;
    const delay = this.config.rateLimit.requestDelay - timeSinceLastRequest;

    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  /**
   * Process request queue
   */
  async processQueue() {
    if (this.isProcessingQueue || this.requestQueue.length === 0) return;

    this.isProcessingQueue = true;

    while (this.requestQueue.length > 0) {
      const request = this.requestQueue.shift();

      if (this.isRateLimited()) {
        console.warn(this.config.errorMessages.rateLimitExceeded);
        request.reject(new Error('RATE_LIMIT_EXCEEDED'));
        continue;
      }

      try {
        await this.waitForRateLimit();
        const result = await this._executeRequest(request.url, request.options);
        request.resolve(result);
      } catch (error) {
        request.reject(error);
      }
    }

    this.isProcessingQueue = false;
  }

  /**
   * Execute HTTP request
   */
  async _executeRequest(url, options = {}) {
    this.requestCount++;
    this.lastRequestTime = Date.now();

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Client-ID ${this.config.accessKey}`,
        'Accept-Version': 'v1',
        ...options.headers
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Queue a request
   */
  queueRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ url, options, resolve, reject });
      this.processQueue();
    });
  }

  /**
   * Search photos by keyword
   * @param {string} query - Search query
   * @param {Object} options - Search options
   * @returns {Promise<Object>} - Search results
   */
  async searchPhotos(query, options = {}) {
    const cacheKey = `search:${query}:${JSON.stringify(options)}`;

    // Check cache
    if (this.config.cache.enabled && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.config.cache.ttl) {
        return cached.data;
      }
    }

    try {
      const params = new URLSearchParams({
        query,
        per_page: options.perPage || this.config.search.perPage,
        orientation: options.orientation || this.config.search.orientation,
        content_filter: options.contentFilter || this.config.search.contentFilter,
        ...options
      });

      const url = `${this.config.apiBaseUrl}/search/photos?${params}`;
      const data = await this.queueRequest(url);

      // Cache the result
      if (this.config.cache.enabled) {
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
        this.saveCacheToStorage();
      }

      return data;
    } catch (error) {
      console.error('Unsplash search error:', error);
      throw error;
    }
  }

  /**
   * Get random photo
   * @param {Object} options - Random photo options
   * @returns {Promise<Object>} - Photo data
   */
  async getRandomPhoto(options = {}) {
    try {
      const params = new URLSearchParams({
        orientation: options.orientation || this.config.search.orientation,
        content_filter: options.contentFilter || this.config.search.contentFilter,
        ...options
      });

      if (options.query) {
        params.append('query', options.query);
      }

      const url = `${this.config.apiBaseUrl}/photos/random?${params}`;
      return await this.queueRequest(url);
    } catch (error) {
      console.error('Unsplash random photo error:', error);
      throw error;
    }
  }

  /**
   * Get photo by ID
   * @param {string} id - Photo ID
   * @returns {Promise<Object>} - Photo data
   */
  async getPhoto(id) {
    const cacheKey = `photo:${id}`;

    // Check cache
    if (this.config.cache.enabled && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.config.cache.ttl) {
        return cached.data;
      }
    }

    try {
      const url = `${this.config.apiBaseUrl}/photos/${id}`;
      const data = await this.queueRequest(url);

      // Cache the result
      if (this.config.cache.enabled) {
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
        this.saveCacheToStorage();
      }

      return data;
    } catch (error) {
      console.error('Unsplash get photo error:', error);
      throw error;
    }
  }

  /**
   * Trigger download endpoint (required by Unsplash API guidelines)
   * @param {string} downloadLocation - Download URL from photo object
   */
  async triggerDownload(downloadLocation) {
    try {
      await this.queueRequest(downloadLocation);
    } catch (error) {
      console.warn('Failed to trigger download:', error);
    }
  }

  /**
   * Build image URL with specific parameters
   * @param {Object} photo - Photo object from Unsplash
   * @param {Object} options - URL options
   * @returns {string} - Image URL
   */
  buildImageUrl(photo, options = {}) {
    if (!photo || !photo.urls) {
      return null;
    }

    const quality = options.quality || this.config.imageQuality.default;
    let url = photo.urls[quality];

    // Add custom dimensions if specified
    if (options.width || options.height) {
      const params = new URLSearchParams();
      if (options.width) params.append('w', options.width);
      if (options.height) params.append('h', options.height);
      if (options.fit) params.append('fit', options.fit);
      if (options.crop) params.append('crop', options.crop);

      url = `${url}&${params}`;
    }

    return url;
  }

  /**
   * Get attribution for a photo
   * @param {Object} photo - Photo object from Unsplash
   * @returns {Object} - Attribution data
   */
  getAttribution(photo) {
    if (!photo || !photo.user) {
      return null;
    }

    return {
      text: ATTRIBUTION_TEMPLATE.text.replace('{photographer}', photo.user.name),
      link: ATTRIBUTION_TEMPLATE.link.replace('{photographerUrl}', photo.user.links.html),
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html
    };
  }

  /**
   * Get image for a specific synonym
   * @param {string} synonym - Synonym word
   * @param {Object} options - Options
   * @returns {Promise<Object>} - Image data with attribution
   */
  async getImageForSynonym(synonym, options = {}) {
    const searchTerm = this.config.synonymSearchTerms[synonym] || synonym;

    try {
      // Try to get from cache first
      const cacheKey = `synonym:${synonym}`;
      if (this.config.cache.enabled && this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        if (Date.now() - cached.timestamp < this.config.cache.ttl) {
          return cached.data;
        }
      }

      // Search for images
      const searchResult = await this.searchPhotos(searchTerm, {
        per_page: 1,
        ...options
      });

      if (!searchResult.results || searchResult.results.length === 0) {
        throw new Error('NO_RESULTS');
      }

      const photo = searchResult.results[0];

      // Trigger download tracking
      if (photo.links && photo.links.download_location) {
        this.triggerDownload(photo.links.download_location);
      }

      const imageData = {
        url: this.buildImageUrl(photo, {
          width: this.config.dimensions.width,
          height: this.config.dimensions.height
        }),
        thumbnailUrl: this.buildImageUrl(photo, {
          quality: 'small',
          width: this.config.dimensions.thumbnailWidth,
          height: this.config.dimensions.thumbnailHeight
        }),
        attribution: this.getAttribution(photo),
        altText: photo.alt_description || photo.description || `Image for ${synonym}`,
        color: photo.color || '#cccccc',
        photoId: photo.id
      };

      // Cache the result
      if (this.config.cache.enabled) {
        this.cache.set(cacheKey, {
          data: imageData,
          timestamp: Date.now()
        });
        this.saveCacheToStorage();
      }

      return imageData;
    } catch (error) {
      console.warn(`Failed to get image for "${synonym}":`, error.message);
      return this.getFallbackImage(synonym);
    }
  }

  /**
   * Get fallback image when API fails
   * @param {string} synonym - Synonym word
   * @returns {Object} - Fallback image data
   */
  getFallbackImage(synonym) {
    const index = synonym.length % this.config.fallbackColors.length;

    return {
      url: null,
      thumbnailUrl: null,
      attribution: null,
      altText: synonym,
      color: this.config.fallbackColors[index],
      isFallback: true
    };
  }

  /**
   * Preload image
   * @param {string} url - Image URL
   * @returns {Promise<void>}
   */
  async preloadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = url;
    });
  }

  /**
   * Preload next synonym image
   * @param {string} nextSynonym - Next synonym to preload
   */
  async preloadNextSynonym(nextSynonym) {
    try {
      const imageData = await this.getImageForSynonym(nextSynonym);
      if (imageData.url) {
        await this.preloadImage(imageData.url);
      }
    } catch (error) {
      console.warn('Failed to preload next synonym:', error);
    }
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
    localStorage.removeItem('unsplash_cache');
  }

  /**
   * Get cache statistics
   * @returns {Object} - Cache stats
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      maxSize: this.config.cache.maxSize,
      requestCount: this.requestCount,
      rateLimitRemaining: this.config.rateLimit.requestsPerHour - this.requestCount
    };
  }
}

// Create singleton instance
const unsplashService = new UnsplashService();

// Initialize on module load
unsplashService.initialize();

export default unsplashService;
