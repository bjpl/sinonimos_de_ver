/**
 * AnnotationOverlay Component
 * Elegant text overlays on images with sophisticated backgrounds
 */

export class AnnotationOverlay {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      position: 'bottom-right', // top-left, top-right, bottom-left, bottom-right, center
      style: 'elegant', // elegant, minimal, bold, subtle
      animation: 'fade', // fade, slide, scale
      autoHide: false,
      hideDelay: 3000,
      ...options
    };

    this.overlay = null;
    this.isVisible = false;
    this.hideTimer = null;
  }

  /**
   * Create and display annotation overlay
   * @param {Object} content - Annotation content
   */
  show(content) {
    if (this.overlay) {
      this.hide();
    }

    this.overlay = this._createOverlay(content);
    this.container.appendChild(this.overlay);

    // Trigger animation
    requestAnimationFrame(() => {
      this.overlay.classList.add('visible');
      this.isVisible = true;
    });

    if (this.options.autoHide) {
      this.hideTimer = setTimeout(() => this.hide(), this.options.hideDelay);
    }

    return this;
  }

  /**
   * Hide annotation overlay
   */
  hide() {
    if (!this.overlay) return;

    this.overlay.classList.remove('visible');
    this.isVisible = false;

    setTimeout(() => {
      if (this.overlay && this.overlay.parentNode) {
        this.overlay.parentNode.removeChild(this.overlay);
      }
      this.overlay = null;
    }, 300); // Animation duration

    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }

    return this;
  }

  /**
   * Toggle overlay visibility
   */
  toggle(content) {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show(content);
    }
    return this;
  }

  /**
   * Create overlay element
   * @private
   */
  _createOverlay(content) {
    const overlay = document.createElement('div');
    overlay.className = `annotation-overlay overlay-${this.options.style} overlay-${this.options.position} animation-${this.options.animation}`;

    const background = document.createElement('div');
    background.className = 'overlay-background';

    const contentContainer = document.createElement('div');
    contentContainer.className = 'overlay-content';

    // Build content based on type
    if (typeof content === 'string') {
      contentContainer.innerHTML = content;
    } else {
      contentContainer.innerHTML = this._buildContentHTML(content);
    }

    overlay.appendChild(background);
    overlay.appendChild(contentContainer);

    // Add close button if not auto-hide
    if (!this.options.autoHide) {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'overlay-close';
      closeBtn.innerHTML = '×';
      closeBtn.onclick = () => this.hide();
      overlay.appendChild(closeBtn);
    }

    return overlay;
  }

  /**
   * Build content HTML from object
   * @private
   */
  _buildContentHTML(content) {
    const parts = [];

    if (content.title) {
      parts.push(`<div class="overlay-title spanish-text">${content.title}</div>`);
    }

    if (content.subtitle) {
      parts.push(`<div class="overlay-subtitle">${content.subtitle}</div>`);
    }

    if (content.body) {
      parts.push(`<div class="overlay-body">${content.body}</div>`);
    }

    if (content.metadata) {
      parts.push(`<div class="overlay-metadata">${content.metadata}</div>`);
    }

    if (content.footer) {
      parts.push(`<div class="overlay-footer">${content.footer}</div>`);
    }

    return parts.join('');
  }

  /**
   * Update overlay position
   * @param {string} position - New position
   */
  setPosition(position) {
    if (!this.overlay) return;

    this.overlay.classList.remove(`overlay-${this.options.position}`);
    this.options.position = position;
    this.overlay.classList.add(`overlay-${position}`);

    return this;
  }

  /**
   * Update overlay style
   * @param {string} style - New style
   */
  setStyle(style) {
    if (!this.overlay) return;

    this.overlay.classList.remove(`overlay-${this.options.style}`);
    this.options.style = style;
    this.overlay.classList.add(`overlay-${style}`);

    return this;
  }

  /**
   * Destroy overlay and cleanup
   */
  destroy() {
    this.hide();
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
    }
    this.container = null;
    this.options = null;
  }
}

/**
 * Static factory methods for common overlay types
 */
AnnotationOverlay.createDefinitionOverlay = (container, definition) => {
  const overlay = new AnnotationOverlay(container, {
    style: 'elegant',
    position: 'bottom-right'
  });

  overlay.show({
    title: definition.verb,
    subtitle: definition.quick_gloss,
    body: definition.nuanced_definition,
    metadata: definition.formality || definition.region
  });

  return overlay;
};

AnnotationOverlay.createRegionalMarker = (container, region, verb) => {
  const overlay = new AnnotationOverlay(container, {
    style: 'minimal',
    position: 'top-right',
    autoHide: true,
    hideDelay: 5000
  });

  const regionalFlags = {
    'mexico': '🇲🇽',
    'argentina': '🇦🇷',
    'spain': '🇪🇸',
    'general': '🌎'
  };

  overlay.show({
    title: regionalFlags[region.toLowerCase()] || '🌎',
    subtitle: region.replace(/_/g, ' ').toUpperCase(),
    body: `"${verb}" is commonly used here`
  });

  return overlay;
};

AnnotationOverlay.createCulturalNote = (container, note) => {
  const overlay = new AnnotationOverlay(container, {
    style: 'bold',
    position: 'center'
  });

  overlay.show({
    title: '🌍 Cultural Note',
    body: note
  });

  return overlay;
};

export default AnnotationOverlay;
