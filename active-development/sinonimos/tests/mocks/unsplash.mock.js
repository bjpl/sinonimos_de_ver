/**
 * Mock Unsplash API Service
 * Provides realistic mock data and error scenarios for testing
 */

export class MockUnsplashService {
  constructor(accessKey) {
    this.accessKey = accessKey || 'mock-key-12345';
    this.callCount = 0;
    this.searchHistory = [];
    this.shouldFail = false;
    this.failureType = null;
    this.downloadDelay = 0;
  }

  /**
   * Mock search photos - returns realistic photo data
   */
  async searchPhotos(query, options = {}) {
    this.callCount++;
    this.searchHistory.push({ query, options, timestamp: new Date() });

    // Simulate failure scenarios
    if (this.shouldFail) {
      return this._simulateFailure(query);
    }

    const { perPage = 1, orientation = 'landscape', page = 1 } = options;

    // Simulate delay
    await this._delay(50);

    // Return mock photo results
    const photos = this._generateMockPhotos(query, perPage);

    if (photos.length === 0) {
      throw new Error(`No results found for query: ${query}`);
    }

    return photos;
  }

  /**
   * Mock download from URL
   */
  async downloadFromUrl(url, filepath) {
    this.callCount++;

    if (this.shouldFail && this.failureType === 'download') {
      throw new Error(`Failed to download: HTTP 404`);
    }

    // Simulate download delay
    await this._delay(this.downloadDelay);

    return filepath;
  }

  /**
   * Mock download image with fallback strategies
   */
  async downloadImage(query, outputPath, fallbackQueries = []) {
    const queries = [query, ...fallbackQueries];
    let lastError;

    for (let i = 0; i < queries.length; i++) {
      const currentQuery = queries[i];

      try {
        const photos = await this.searchPhotos(currentQuery);
        const photo = photos[0];

        await this.downloadFromUrl(photo.urls.regular, outputPath);

        return {
          filename: outputPath.split('/').pop(),
          photographer: photo.user.name,
          photographerUrl: photo.user.links.html,
          unsplashUrl: photo.links.html,
          description: photo.description || photo.alt_description,
          color: photo.color,
          width: photo.width,
          height: photo.height,
          query: currentQuery,
          attemptNumber: i + 1,
          downloadedAt: new Date().toISOString()
        };

      } catch (error) {
        lastError = error;
        if (i === queries.length - 1) {
          throw new Error(`Failed to download image after ${queries.length} attempts. Last query: "${currentQuery}" - ${error.message}`);
        }
      }
    }
  }

  /**
   * Mock track download
   */
  async trackDownload(downloadLocation) {
    if (!downloadLocation) return;
    await this._delay(10);
    return { success: true };
  }

  /**
   * Build smart query (same as real implementation)
   */
  buildSmartQuery(verb, context, formality) {
    const contextMap = {
      'literario': 'artistic aesthetic elegant sophisticated',
      'profesional': 'professional formal business',
      'cotidiano': 'authentic real life everyday',
      'narrativo': 'storytelling atmospheric cinematic'
    };

    const formalityMap = {
      'formal': 'refined elegant sophisticated',
      'neutral': 'natural authentic',
      'informal': 'casual relaxed candid'
    };

    const verbConceptMap = {
      'comer': 'eating dining meal food',
      'ver': 'seeing vision eyes watching',
      'mirar': 'looking watching observing gazing',
      'caminar': 'walking path nature hiking',
      'hablar': 'speaking conversation talking communication'
    };

    const concept = verbConceptMap[verb.toLowerCase()] || verb;
    const contextWords = contextMap[context] || '';
    const formalityWords = formalityMap[formality] || '';

    return `${concept} ${contextWords} ${formalityWords}`.trim();
  }

  // === Test Helper Methods ===

  /**
   * Configure mock to fail
   */
  setFailure(shouldFail, type = 'search') {
    this.shouldFail = shouldFail;
    this.failureType = type;
  }

  /**
   * Set download delay for testing timeouts
   */
  setDownloadDelay(ms) {
    this.downloadDelay = ms;
  }

  /**
   * Reset mock state
   */
  reset() {
    this.callCount = 0;
    this.searchHistory = [];
    this.shouldFail = false;
    this.failureType = null;
    this.downloadDelay = 0;
  }

  /**
   * Get call statistics
   */
  getStats() {
    return {
      totalCalls: this.callCount,
      searches: this.searchHistory.length,
      uniqueQueries: new Set(this.searchHistory.map(s => s.query)).size,
      history: this.searchHistory
    };
  }

  // === Private Helper Methods ===

  _generateMockPhotos(query, count) {
    const photos = [];

    for (let i = 0; i < count; i++) {
      photos.push({
        id: `mock-photo-${query}-${i}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        width: 4000,
        height: 3000,
        color: '#' + Math.floor(Math.random()*16777215).toString(16),
        description: `Mock photo for ${query}`,
        alt_description: `A beautiful ${query} scene`,
        urls: {
          raw: `https://images.unsplash.com/mock-${query}-${i}?raw`,
          full: `https://images.unsplash.com/mock-${query}-${i}?full`,
          regular: `https://images.unsplash.com/mock-${query}-${i}?regular`,
          small: `https://images.unsplash.com/mock-${query}-${i}?small`,
          thumb: `https://images.unsplash.com/mock-${query}-${i}?thumb`
        },
        links: {
          self: `https://api.unsplash.com/photos/mock-${query}-${i}`,
          html: `https://unsplash.com/photos/mock-${query}-${i}`,
          download: `https://unsplash.com/photos/mock-${query}-${i}/download`,
          download_location: `https://api.unsplash.com/photos/mock-${query}-${i}/download`
        },
        user: {
          id: 'mock-user-1',
          username: 'mockphotographer',
          name: 'Mock Photographer',
          first_name: 'Mock',
          last_name: 'Photographer',
          portfolio_url: 'https://unsplash.com/@mockphotographer',
          bio: 'Professional mock photographer',
          links: {
            self: 'https://api.unsplash.com/users/mockphotographer',
            html: 'https://unsplash.com/@mockphotographer',
            photos: 'https://api.unsplash.com/users/mockphotographer/photos'
          }
        }
      });
    }

    return photos;
  }

  _simulateFailure(query) {
    switch (this.failureType) {
      case 'search':
        throw new Error(`Unsplash API error: Rate limit exceeded`);
      case 'no_results':
        return [];
      case 'auth':
        throw new Error(`Unsplash API error: Invalid access token`);
      case 'network':
        throw new Error(`Network error: ECONNREFUSED`);
      case 'timeout':
        return new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), 5000);
        });
      default:
        throw new Error(`Unknown error occurred`);
    }
  }

  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Factory functions for common test scenarios

export function createMockUnsplashService(config = {}) {
  const service = new MockUnsplashService(config.accessKey);

  if (config.shouldFail) {
    service.setFailure(true, config.failureType);
  }

  if (config.downloadDelay) {
    service.setDownloadDelay(config.downloadDelay);
  }

  return service;
}

export function createFailingUnsplashService(failureType = 'search') {
  return createMockUnsplashService({ shouldFail: true, failureType });
}

export default MockUnsplashService;
