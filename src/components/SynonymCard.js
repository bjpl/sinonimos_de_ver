/**
 * SynonymCard Component
 * Elegant card display for synonym information with layered interaction
 */

import { contentFormatter } from '../scripts/utils/contentFormatter.js';

export class SynonymCard {
  constructor(data, options = {}) {
    this.data = data;
    this.options = {
      expandable: true,
      showRegion: true,
      showFormality: true,
      showExamples: true,
      interactive: true,
      ...options
    };

    this.element = null;
    this.isExpanded = false;
    this.currentLayer = 1;
  }

  /**
   * Render the synonym card
   * @returns {HTMLElement} Card element
   */
  render() {
    this.element = document.createElement('div');
    this.element.className = 'synonym-card';
    this.element.dataset.verb = this.data.verb;

    // Layer 1: Always visible
    const layer1 = this._createLayer1();
    this.element.appendChild(layer1);

    // Layer 2: Show on hover
    if (this.data.nuanced_definition) {
      const layer2 = this._createLayer2();
      this.element.appendChild(layer2);
    }

    // Layer 3: Show on click/expand
    if (this.options.expandable && this.data.full_context) {
      const layer3 = this._createLayer3();
      this.element.appendChild(layer3);

      // Add expand button
      const expandBtn = this._createExpandButton();
      this.element.appendChild(expandBtn);
    }

    // Add interaction handlers
    if (this.options.interactive) {
      this._attachEventHandlers();
    }

    return this.element;
  }

  /**
   * Create Layer 1: Verb + Quick gloss (always visible)
   * @private
   */
  _createLayer1() {
    const layer = document.createElement('div');
    layer.className = 'card-layer card-layer-1 always-visible';

    const header = document.createElement('div');
    header.className = 'card-header';

    const verb = document.createElement('h3');
    verb.className = 'card-verb spanish-text';
    verb.textContent = this.data.verb;

    const gloss = document.createElement('p');
    gloss.className = 'card-gloss english-text';
    gloss.textContent = this.data.quick_gloss || this.data.definition;

    header.appendChild(verb);
    header.appendChild(gloss);

    // Add metadata tags
    if (this.options.showRegion || this.options.showFormality) {
      const metadata = this._createMetadataSection();
      header.appendChild(metadata);
    }

    layer.appendChild(header);

    return layer;
  }

  /**
   * Create Layer 2: Nuanced definition (hover)
   * @private
   */
  _createLayer2() {
    const layer = document.createElement('div');
    layer.className = 'card-layer card-layer-2 show-on-hover';

    const indicator = document.createElement('div');
    indicator.className = 'layer-indicator';
    indicator.textContent = 'More detail';

    const definition = document.createElement('div');
    definition.className = 'card-nuanced-definition';
    definition.innerHTML = this.data.nuanced_definition;

    layer.appendChild(indicator);
    layer.appendChild(definition);

    return layer;
  }

  /**
   * Create Layer 3: Full context (click/expand)
   * @private
   */
  _createLayer3() {
    const layer = document.createElement('div');
    layer.className = 'card-layer card-layer-3 show-on-expand';

    const indicator = document.createElement('div');
    indicator.className = 'layer-indicator';
    indicator.textContent = 'Full context';

    const content = document.createElement('div');
    content.className = 'card-full-content';

    // Full context
    if (this.data.full_context) {
      const contextDiv = document.createElement('div');
      contextDiv.className = 'full-context';
      contextDiv.innerHTML = this.data.full_context;
      content.appendChild(contextDiv);
    }

    // Etymology
    if (this.data.etymology) {
      const etymologyDiv = document.createElement('div');
      etymologyDiv.className = 'etymology-note';
      etymologyDiv.innerHTML = `
        <span class="etymology-label">Etymology:</span>
        ${this.data.etymology}
      `;
      content.appendChild(etymologyDiv);
    }

    // Usage notes
    if (this.data.usage_notes) {
      const usageDiv = document.createElement('div');
      usageDiv.className = 'usage-notes';
      usageDiv.innerHTML = `
        <span class="usage-label">Usage notes:</span>
        ${this.data.usage_notes}
      `;
      content.appendChild(usageDiv);
    }

    // Examples
    if (this.options.showExamples && this.data.examples) {
      const examplesDiv = this._createExamplesSection();
      content.appendChild(examplesDiv);
    }

    layer.appendChild(indicator);
    layer.appendChild(content);

    return layer;
  }

  /**
   * Create metadata section (region, formality)
   * @private
   */
  _createMetadataSection() {
    const metadata = document.createElement('div');
    metadata.className = 'card-metadata';

    const tags = [];

    // Region tag
    if (this.options.showRegion && this.data.region) {
      const regionalFlags = {
        'mexico': '🇲🇽',
        'argentina': '🇦🇷',
        'spain': '🇪🇸',
        'colombia': '🇨🇴',
        'general': '🌎'
      };

      const flag = regionalFlags[this.data.region.toLowerCase()] || '🌎';
      const regionName = this.data.region.replace(/_/g, ' ');

      tags.push(`
        <span class="metadata-tag regional-tag" data-region="${this.data.region}">
          ${flag} ${regionName}
        </span>
      `);
    }

    // Formality tag
    if (this.options.showFormality && this.data.formality) {
      const formalityIcons = {
        'formal': '👔',
        'informal': '💬',
        'literary': '📚',
        'colloquial': '🗣️'
      };

      const icon = formalityIcons[this.data.formality] || '⚖️';

      tags.push(`
        <span class="metadata-tag formality-tag formality-${this.data.formality}">
          ${icon} ${this.data.formality}
        </span>
      `);
    }

    // Context tag
    if (this.data.context) {
      tags.push(`
        <span class="metadata-tag context-tag context-${this.data.context}">
          ${this.data.context}
        </span>
      `);
    }

    metadata.innerHTML = tags.join('');

    return metadata;
  }

  /**
   * Create examples section
   * @private
   */
  _createExamplesSection() {
    const section = document.createElement('div');
    section.className = 'card-examples';

    const title = document.createElement('h4');
    title.className = 'examples-title';
    title.textContent = 'Examples';

    section.appendChild(title);

    const examples = Array.isArray(this.data.examples)
      ? this.data.examples
      : [this.data.examples];

    examples.forEach(example => {
      const exampleDiv = document.createElement('div');
      exampleDiv.className = 'example-item';

      if (typeof example === 'string') {
        exampleDiv.innerHTML = contentFormatter.formatExampleSentence(
          example,
          this.data.verb
        );
      } else {
        exampleDiv.innerHTML = contentFormatter.formatExampleSentence(
          example.sentence,
          this.data.verb,
          {
            region: example.region,
            formality: example.formality,
            translation: example.translation
          }
        );
      }

      section.appendChild(exampleDiv);
    });

    return section;
  }

  /**
   * Create expand/collapse button
   * @private
   */
  _createExpandButton() {
    const button = document.createElement('button');
    button.className = 'card-expand-btn';
    button.innerHTML = `
      <span class="expand-icon">▼</span>
      <span class="expand-text">Show more</span>
    `;

    button.onclick = () => this.toggleExpand();

    return button;
  }

  /**
   * Attach event handlers
   * @private
   */
  _attachEventHandlers() {
    // Hover effects for Layer 2
    this.element.addEventListener('mouseenter', () => {
      if (this.currentLayer < 2 && !this.isExpanded) {
        this.currentLayer = 2;
        this.element.classList.add('layer-2-active');
      }
    });

    this.element.addEventListener('mouseleave', () => {
      if (!this.isExpanded) {
        this.currentLayer = 1;
        this.element.classList.remove('layer-2-active');
      }
    });

    // Click analytics
    this.element.addEventListener('click', (e) => {
      if (!e.target.closest('.card-expand-btn')) {
        this._trackInteraction('click');
      }
    });
  }

  /**
   * Toggle expanded state
   */
  toggleExpand() {
    this.isExpanded = !this.isExpanded;

    if (this.isExpanded) {
      this.element.classList.add('expanded');
      this.currentLayer = 3;
      const btn = this.element.querySelector('.card-expand-btn');
      if (btn) {
        btn.querySelector('.expand-icon').textContent = '▲';
        btn.querySelector('.expand-text').textContent = 'Show less';
      }
    } else {
      this.element.classList.remove('expanded');
      this.currentLayer = 1;
      const btn = this.element.querySelector('.card-expand-btn');
      if (btn) {
        btn.querySelector('.expand-icon').textContent = '▼';
        btn.querySelector('.expand-text').textContent = 'Show more';
      }
    }

    this._trackInteraction(this.isExpanded ? 'expand' : 'collapse');

    return this;
  }

  /**
   * Expand card
   */
  expand() {
    if (!this.isExpanded) {
      this.toggleExpand();
    }
    return this;
  }

  /**
   * Collapse card
   */
  collapse() {
    if (this.isExpanded) {
      this.toggleExpand();
    }
    return this;
  }

  /**
   * Track user interaction
   * @private
   */
  _trackInteraction(type) {
    if (typeof this.options.onInteraction === 'function') {
      this.options.onInteraction({
        type,
        verb: this.data.verb,
        layer: this.currentLayer,
        timestamp: Date.now()
      });
    }
  }

  /**
   * Update card data
   */
  updateData(newData) {
    this.data = { ...this.data, ...newData };
    if (this.element) {
      const parent = this.element.parentNode;
      const newElement = this.render();
      if (parent) {
        parent.replaceChild(newElement, this.element);
      }
    }
    return this;
  }

  /**
   * Destroy card and cleanup
   */
  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
    this.data = null;
  }
}

export default SynonymCard;
