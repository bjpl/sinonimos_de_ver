/**
 * ExampleSentence Component
 * Interactive example sentences with verb highlighting and translation
 */

export class ExampleSentence {
  constructor(data, options = {}) {
    this.data = data;
    this.options = {
      highlightVerb: true,
      showTranslation: true,
      showMetadata: true,
      interactive: true,
      playAudio: false,
      ...options
    };

    this.element = null;
    this.isExpanded = false;
  }

  /**
   * Render example sentence
   * @returns {HTMLElement} Sentence element
   */
  render() {
    this.element = document.createElement('div');
    this.element.className = 'example-sentence';
    this.element.dataset.verb = this.data.verb;

    // Main sentence
    const sentenceDiv = this._createSentenceElement();
    this.element.appendChild(sentenceDiv);

    // Metadata (region, formality, context)
    if (this.options.showMetadata && this._hasMetadata()) {
      const metadataDiv = this._createMetadataElement();
      this.element.appendChild(metadataDiv);
    }

    // Translation
    if (this.options.showTranslation && this.data.translation) {
      const translationDiv = this._createTranslationElement();
      this.element.appendChild(translationDiv);
    }

    // Audio button (if available)
    if (this.options.playAudio && this.data.audio) {
      const audioBtn = this._createAudioButton();
      this.element.appendChild(audioBtn);
    }

    // Interactive features
    if (this.options.interactive) {
      this._attachEventHandlers();
    }

    return this.element;
  }

  /**
   * Create sentence element with verb highlighting
   * @private
   */
  _createSentenceElement() {
    const div = document.createElement('div');
    div.className = 'sentence-text spanish-text';

    const sentence = this.data.sentence || this.data.text;

    if (this.options.highlightVerb && this.data.verb) {
      div.innerHTML = this._highlightVerb(sentence, this.data.verb);
    } else {
      div.textContent = sentence;
    }

    return div;
  }

  /**
   * Highlight verb in sentence
   * @private
   */
  _highlightVerb(sentence, verb) {
    // Get verb root for conjugation matching
    const verbRoot = this._getVerbRoot(verb);
    const pattern = new RegExp(`\\b(${verb}|${verbRoot}\\w*)\\b`, 'gi');

    return sentence.replace(pattern, (match) => {
      return `<span class="verb-highlight" data-verb="${verb}" title="Conjugation of ${verb}">${match}</span>`;
    });
  }

  /**
   * Get verb root (remove -ar, -er, -ir)
   * @private
   */
  _getVerbRoot(verb) {
    return verb.replace(/(?:ar|er|ir)$/, '');
  }

  /**
   * Check if metadata exists
   * @private
   */
  _hasMetadata() {
    return this.data.region || this.data.formality || this.data.context;
  }

  /**
   * Create metadata element
   * @private
   */
  _createMetadataElement() {
    const div = document.createElement('div');
    div.className = 'sentence-metadata';

    const tags = [];

    // Region tag
    if (this.data.region) {
      const regionalFlags = {
        'mexico': '🇲🇽',
        'argentina': '🇦🇷',
        'spain': '🇪🇸',
        'colombia': '🇨🇴',
        'chile': '🇨🇱',
        'general': '🌎'
      };

      const flag = regionalFlags[this.data.region.toLowerCase()] || '🌎';
      const regionName = this._formatRegionName(this.data.region);

      tags.push(`
        <span class="metadata-tag regional-tag" data-region="${this.data.region}">
          ${flag} ${regionName}
        </span>
      `);
    }

    // Formality tag
    if (this.data.formality) {
      const formalityIcons = {
        'formal': '👔',
        'informal': '💬',
        'literary': '📚',
        'colloquial': '🗣️',
        'neutral': '⚖️'
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

    div.innerHTML = tags.join('');

    return div;
  }

  /**
   * Format region name
   * @private
   */
  _formatRegionName(region) {
    return region
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Create translation element
   * @private
   */
  _createTranslationElement() {
    const div = document.createElement('div');
    div.className = 'sentence-translation english-text';

    const icon = document.createElement('span');
    icon.className = 'translation-icon';
    icon.textContent = '→';

    const text = document.createElement('span');
    text.className = 'translation-text';
    text.textContent = this.data.translation;

    div.appendChild(icon);
    div.appendChild(text);

    return div;
  }

  /**
   * Create audio playback button
   * @private
   */
  _createAudioButton() {
    const button = document.createElement('button');
    button.className = 'audio-play-btn';
    button.innerHTML = `
      <span class="audio-icon">🔊</span>
      <span class="audio-text">Listen</span>
    `;

    button.onclick = () => this.playAudio();

    return button;
  }

  /**
   * Attach event handlers
   * @private
   */
  _attachEventHandlers() {
    // Click to toggle translation visibility
    const sentenceText = this.element.querySelector('.sentence-text');
    sentenceText?.addEventListener('click', () => {
      this.toggleTranslation();
    });

    // Hover effect on verb highlight
    const verbHighlights = this.element.querySelectorAll('.verb-highlight');
    verbHighlights.forEach(highlight => {
      highlight.addEventListener('mouseenter', () => {
        highlight.classList.add('hover');
      });

      highlight.addEventListener('mouseleave', () => {
        highlight.classList.remove('hover');
      });

      highlight.addEventListener('click', (e) => {
        e.stopPropagation();
        this._showVerbDetails(this.data.verb);
      });
    });
  }

  /**
   * Toggle translation visibility
   */
  toggleTranslation() {
    const translation = this.element.querySelector('.sentence-translation');
    if (!translation) return;

    this.isExpanded = !this.isExpanded;
    translation.classList.toggle('visible', this.isExpanded);

    return this;
  }

  /**
   * Play audio (if available)
   */
  playAudio() {
    if (!this.data.audio) return;

    // Create audio element if not exists
    if (!this.audioElement) {
      this.audioElement = new Audio(this.data.audio);
    }

    this.audioElement.play();

    // Update button state
    const btn = this.element.querySelector('.audio-play-btn');
    if (btn) {
      btn.classList.add('playing');

      this.audioElement.addEventListener('ended', () => {
        btn.classList.remove('playing');
      });
    }

    return this;
  }

  /**
   * Show verb details (trigger custom event)
   * @private
   */
  _showVerbDetails(verb) {
    if (typeof this.options.onVerbClick === 'function') {
      this.options.onVerbClick(verb);
    }

    // Dispatch custom event
    const event = new CustomEvent('verbClick', {
      detail: { verb, sentence: this.data },
      bubbles: true
    });
    this.element.dispatchEvent(event);
  }

  /**
   * Update sentence data
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
   * Destroy component
   */
  destroy() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement = null;
    }

    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }

    this.element = null;
    this.data = null;
  }
}

export default ExampleSentence;
