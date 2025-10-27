/**
 * Synonym Image Card Component
 * Complete component for displaying synonym with contextual image
 */

import unsplashService from '../services/unsplash.js';
import { createImageElement, createLoadingPlaceholder } from '../utils/imageHelpers.js';

export class SynonymImageCard {
  constructor(options = {}) {
    this.options = {
      showDefinition: true,
      showExamples: true,
      showAttribution: true,
      progressiveLoading: true,
      lazyLoading: false,
      preloadNext: true,
      ...options
    };

    this.element = null;
    this.currentSynonym = null;
    this.imageData = null;
  }

  /**
   * Create the card element structure
   * @returns {HTMLElement}
   */
  createElement() {
    const card = document.createElement('div');
    card.className = 'synonym-card';

    // Image container
    const imageContainer = document.createElement('div');
    imageContainer.className = 'synonym-card__image';
    card.appendChild(imageContainer);

    // Content container
    const content = document.createElement('div');
    content.className = 'synonym-card__content';

    // Synonym title
    const title = document.createElement('h2');
    title.className = 'synonym-card__title';
    content.appendChild(title);

    // Definition (optional)
    if (this.options.showDefinition) {
      const definition = document.createElement('p');
      definition.className = 'synonym-card__definition';
      content.appendChild(definition);
    }

    // Examples (optional)
    if (this.options.showExamples) {
      const examples = document.createElement('div');
      examples.className = 'synonym-card__examples';
      content.appendChild(examples);
    }

    card.appendChild(content);

    return card;
  }

  /**
   * Render synonym with image
   * @param {Object} synonymData - Synonym data
   * @returns {Promise<HTMLElement>}
   */
  async render(synonymData) {
    this.currentSynonym = synonymData;

    if (!this.element) {
      this.element = this.createElement();
    }

    // Update title
    const title = this.element.querySelector('.synonym-card__title');
    title.textContent = synonymData.word;

    // Update definition
    if (this.options.showDefinition && synonymData.definition) {
      const definition = this.element.querySelector('.synonym-card__definition');
      definition.textContent = synonymData.definition;
    }

    // Update examples
    if (this.options.showExamples && synonymData.examples) {
      const examplesContainer = this.element.querySelector('.synonym-card__examples');
      examplesContainer.innerHTML = '<h3>Ejemplos:</h3>';

      const list = document.createElement('ul');
      synonymData.examples.forEach(example => {
        const item = document.createElement('li');
        item.textContent = example;
        list.appendChild(item);
      });
      examplesContainer.appendChild(list);
    }

    // Load and display image
    await this.loadImage(synonymData.word);

    // Preload next synonym if enabled
    if (this.options.preloadNext && synonymData.next) {
      this.preloadNext(synonymData.next);
    }

    return this.element;
  }

  /**
   * Load image for synonym
   * @param {string} synonym - Synonym word
   */
  async loadImage(synonym) {
    const imageContainer = this.element.querySelector('.synonym-card__image');

    // Show loading placeholder
    const placeholder = createLoadingPlaceholder({
      text: 'Cargando imagen...'
    });
    imageContainer.innerHTML = '';
    imageContainer.appendChild(placeholder);

    try {
      // Fetch image data
      this.imageData = await unsplashService.getImageForSynonym(synonym);

      // Create image element
      const imageEl = createImageElement(this.imageData, {
        lazy: this.options.lazyLoading,
        progressive: this.options.progressiveLoading,
        showAttribution: this.options.showAttribution,
        onLoad: () => {
          this.element.classList.add('image-loaded');
        },
        onError: (error) => {
          console.warn('Image load error:', error);
          this.element.classList.add('image-error');
        }
      });

      // Replace placeholder with image
      imageContainer.innerHTML = '';
      imageContainer.appendChild(imageEl);
    } catch (error) {
      console.error('Failed to load image:', error);

      // Show error state
      imageContainer.innerHTML = '<div class="image-error">Error al cargar imagen</div>';
      this.element.classList.add('image-error');
    }
  }

  /**
   * Preload next synonym image
   * @param {string} nextSynonym - Next synonym word
   */
  async preloadNext(nextSynonym) {
    try {
      await unsplashService.preloadNextSynonym(nextSynonym);
    } catch (error) {
      console.warn('Failed to preload next synonym:', error);
    }
  }

  /**
   * Update to new synonym
   * @param {Object} synonymData - New synonym data
   */
  async update(synonymData) {
    this.element.classList.add('updating');

    await this.render(synonymData);

    // Trigger transition
    requestAnimationFrame(() => {
      this.element.classList.remove('updating');
      this.element.classList.add('updated');

      setTimeout(() => {
        this.element.classList.remove('updated');
      }, 300);
    });
  }

  /**
   * Get current image data
   * @returns {Object}
   */
  getImageData() {
    return this.imageData;
  }

  /**
   * Refresh image from API
   */
  async refreshImage() {
    if (!this.currentSynonym) return;

    // Clear cache for this synonym
    const cacheKey = `synonym:${this.currentSynonym.word}`;
    unsplashService.cache.delete(cacheKey);

    // Reload image
    await this.loadImage(this.currentSynonym.word);
  }

  /**
   * Destroy component
   */
  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
    this.currentSynonym = null;
    this.imageData = null;
  }
}

/**
 * Create and render a synonym card
 * @param {Object} synonymData - Synonym data
 * @param {Object} options - Component options
 * @returns {Promise<SynonymImageCard>}
 */
export async function createSynonymCard(synonymData, options = {}) {
  const card = new SynonymImageCard(options);
  await card.render(synonymData);
  return card;
}

export default SynonymImageCard;
