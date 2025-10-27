/**
 * RegionalMarker Component
 * Visual markers for regional variations with elegant highlights
 */

export class RegionalMarker {
  constructor(region, options = {}) {
    this.region = region;
    this.options = {
      style: 'badge', // badge, flag, inline, overlay
      interactive: true,
      showDetails: true,
      position: 'top-right',
      ...options
    };

    this.element = null;
    this.detailsPanel = null;

    this.regionalData = {
      'mexico': {
        name: 'Mexico',
        flag: '🇲🇽',
        color: '#006847',
        description: 'Used commonly in Mexican Spanish',
        variants: ['Central Mexico', 'Northern Mexico', 'Yucatan']
      },
      'argentina': {
        name: 'Argentina',
        flag: '🇦🇷',
        color: '#74ACDF',
        description: 'Common in Argentine Spanish (Rioplatense)',
        variants: ['Buenos Aires', 'Córdoba', 'Mendoza']
      },
      'spain': {
        name: 'Spain',
        flag: '🇪🇸',
        color: '#AA151B',
        description: 'European Spanish usage',
        variants: ['Castilian', 'Andalusian', 'Catalan region']
      },
      'colombia': {
        name: 'Colombia',
        flag: '🇨🇴',
        color: '#FCD116',
        description: 'Colombian Spanish variation',
        variants: ['Bogotá', 'Medellín', 'Coastal']
      },
      'chile': {
        name: 'Chile',
        flag: '🇨🇱',
        color: '#D52B1E',
        description: 'Chilean Spanish usage',
        variants: ['Santiago', 'Valparaíso', 'Southern Chile']
      },
      'peru': {
        name: 'Peru',
        flag: '🇵🇪',
        color: '#D91023',
        description: 'Peruvian Spanish variation',
        variants: ['Lima', 'Cusco', 'Arequipa']
      },
      'general': {
        name: 'General',
        flag: '🌎',
        color: '#2ecc71',
        description: 'Used across Spanish-speaking regions',
        variants: ['Universal']
      }
    };
  }

  /**
   * Render regional marker
   * @returns {HTMLElement} Marker element
   */
  render() {
    const data = this.regionalData[this.region.toLowerCase()] || this.regionalData.general;

    this.element = document.createElement('div');
    this.element.className = `regional-marker marker-${this.options.style} position-${this.options.position}`;
    this.element.dataset.region = this.region;
    this.element.style.setProperty('--region-color', data.color);

    // Render based on style
    switch (this.options.style) {
      case 'badge':
        this._renderBadgeStyle(data);
        break;
      case 'flag':
        this._renderFlagStyle(data);
        break;
      case 'inline':
        this._renderInlineStyle(data);
        break;
      case 'overlay':
        this._renderOverlayStyle(data);
        break;
      default:
        this._renderBadgeStyle(data);
    }

    // Add interactive features
    if (this.options.interactive) {
      this._attachEventHandlers(data);
    }

    return this.element;
  }

  /**
   * Render badge style
   * @private
   */
  _renderBadgeStyle(data) {
    this.element.innerHTML = `
      <span class="marker-flag">${data.flag}</span>
      <span class="marker-name">${data.name}</span>
    `;
  }

  /**
   * Render flag-only style
   * @private
   */
  _renderFlagStyle(data) {
    this.element.innerHTML = `
      <span class="marker-flag-large">${data.flag}</span>
    `;
    this.element.title = data.name;
  }

  /**
   * Render inline style
   * @private
   */
  _renderInlineStyle(data) {
    this.element.innerHTML = `
      <span class="marker-flag-inline">${data.flag}</span>
      <span class="marker-text-inline">${data.name}</span>
      <span class="marker-separator">•</span>
    `;
  }

  /**
   * Render overlay style
   * @private
   */
  _renderOverlayStyle(data) {
    this.element.innerHTML = `
      <div class="marker-overlay-bg"></div>
      <div class="marker-overlay-content">
        <span class="marker-flag-overlay">${data.flag}</span>
        <span class="marker-name-overlay">${data.name}</span>
      </div>
    `;
  }

  /**
   * Attach event handlers
   * @private
   */
  _attachEventHandlers(data) {
    if (this.options.showDetails) {
      this.element.addEventListener('click', (e) => {
        e.stopPropagation();
        this.showDetails(data);
      });

      this.element.addEventListener('mouseenter', () => {
        this.element.classList.add('hover');
      });

      this.element.addEventListener('mouseleave', () => {
        this.element.classList.remove('hover');
      });
    }
  }

  /**
   * Show regional details panel
   * @param {Object} data - Regional data
   */
  showDetails(data) {
    if (this.detailsPanel) {
      this.hideDetails();
      return;
    }

    this.detailsPanel = document.createElement('div');
    this.detailsPanel.className = 'regional-details-panel';

    this.detailsPanel.innerHTML = `
      <div class="details-header">
        <span class="details-flag">${data.flag}</span>
        <h3 class="details-title">${data.name}</h3>
        <button class="details-close">×</button>
      </div>
      <div class="details-content">
        <p class="details-description">${data.description}</p>
        ${data.variants && data.variants.length > 0 ? `
          <div class="details-variants">
            <h4 class="variants-title">Regional Variants:</h4>
            <ul class="variants-list">
              ${data.variants.map(v => `<li>${v}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `;

    // Position panel
    this._positionDetailsPanel();

    // Add to DOM
    document.body.appendChild(this.detailsPanel);

    // Animate in
    requestAnimationFrame(() => {
      this.detailsPanel.classList.add('visible');
    });

    // Close button
    const closeBtn = this.detailsPanel.querySelector('.details-close');
    closeBtn.onclick = () => this.hideDetails();

    // Click outside to close
    const clickOutside = (e) => {
      if (!this.detailsPanel.contains(e.target) && !this.element.contains(e.target)) {
        this.hideDetails();
        document.removeEventListener('click', clickOutside);
      }
    };
    setTimeout(() => {
      document.addEventListener('click', clickOutside);
    }, 100);

    return this;
  }

  /**
   * Position details panel relative to marker
   * @private
   */
  _positionDetailsPanel() {
    if (!this.detailsPanel || !this.element) return;

    const markerRect = this.element.getBoundingClientRect();
    const panelWidth = 300;
    const panelHeight = 200;

    let left = markerRect.left;
    let top = markerRect.bottom + 10;

    // Adjust if would overflow viewport
    if (left + panelWidth > window.innerWidth) {
      left = window.innerWidth - panelWidth - 20;
    }

    if (top + panelHeight > window.innerHeight) {
      top = markerRect.top - panelHeight - 10;
    }

    this.detailsPanel.style.left = `${left}px`;
    this.detailsPanel.style.top = `${top}px`;
  }

  /**
   * Hide details panel
   */
  hideDetails() {
    if (!this.detailsPanel) return;

    this.detailsPanel.classList.remove('visible');

    setTimeout(() => {
      if (this.detailsPanel && this.detailsPanel.parentNode) {
        this.detailsPanel.parentNode.removeChild(this.detailsPanel);
      }
      this.detailsPanel = null;
    }, 300);

    return this;
  }

  /**
   * Create multiple regional markers
   * @static
   * @param {Array} regions - Array of region strings
   * @param {Object} options - Marker options
   * @returns {Array} Array of RegionalMarker instances
   */
  static createMultiple(regions, options = {}) {
    return regions.map(region => {
      const marker = new RegionalMarker(region, options);
      return marker.render();
    });
  }

  /**
   * Create comparison view for regions
   * @static
   * @param {Array} regions - Array of region strings
   * @returns {HTMLElement} Comparison container
   */
  static createComparison(regions) {
    const container = document.createElement('div');
    container.className = 'regional-comparison-view';

    const title = document.createElement('h3');
    title.className = 'comparison-title';
    title.textContent = 'Regional Usage';
    container.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'comparison-grid';

    regions.forEach(region => {
      const marker = new RegionalMarker(region, {
        style: 'badge',
        interactive: true
      });
      const rendered = marker.render();
      grid.appendChild(rendered);
    });

    container.appendChild(grid);

    return container;
  }

  /**
   * Destroy marker and cleanup
   */
  destroy() {
    this.hideDetails();

    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }

    this.element = null;
  }
}

export default RegionalMarker;
