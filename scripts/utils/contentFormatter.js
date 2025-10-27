/**
 * Content Formatter - Sophisticated text formatting for synonym learning
 * Handles regional tags, formality indicators, and contextual markers
 */

export class ContentFormatter {
  constructor() {
    this.regionalFlags = {
      'mexico': '🇲🇽',
      'argentina': '🇦🇷',
      'spain': '🇪🇸',
      'colombia': '🇨🇴',
      'chile': '🇨🇱',
      'peru': '🇵🇪',
      'venezuela': '🇻🇪',
      'cuba': '🇨🇺',
      'dominican_republic': '🇩🇴',
      'puerto_rico': '🇵🇷',
      'general': '🌎'
    };

    this.formalityLevels = {
      'formal': { label: 'Formal', icon: '👔', class: 'formality-formal' },
      'informal': { label: 'Informal', icon: '💬', class: 'formality-informal' },
      'literary': { label: 'Literary', icon: '📚', class: 'formality-literary' },
      'colloquial': { label: 'Colloquial', icon: '🗣️', class: 'formality-colloquial' },
      'neutral': { label: 'Neutral', icon: '⚖️', class: 'formality-neutral' }
    };

    this.contextMarkers = {
      'poetic': { label: 'Poetic', class: 'context-poetic', color: '#9b59b6' },
      'technical': { label: 'Technical', class: 'context-technical', color: '#3498db' },
      'colloquial': { label: 'Colloquial', class: 'context-colloquial', color: '#e67e22' },
      'archaic': { label: 'Archaic', class: 'context-archaic', color: '#95a5a6' },
      'slang': { label: 'Slang', class: 'context-slang', color: '#e74c3c' },
      'idiomatic': { label: 'Idiomatic', class: 'context-idiomatic', color: '#1abc9c' }
    };
  }

  /**
   * Format example sentence with verb highlighting
   * @param {string} sentence - The example sentence
   * @param {string} verb - The verb to highlight
   * @param {Object} options - Additional formatting options
   * @returns {string} HTML formatted sentence
   */
  formatExampleSentence(sentence, verb, options = {}) {
    const {
      region = null,
      formality = null,
      context = null,
      translation = null
    } = options;

    const highlightedSentence = this._highlightVerb(sentence, verb);
    const metadata = this._buildMetadata(region, formality, context);

    return `
      <div class="example-sentence" data-verb="${verb}">
        <div class="sentence-text spanish-text">
          ${highlightedSentence}
        </div>
        ${metadata ? `<div class="sentence-metadata">${metadata}</div>` : ''}
        ${translation ? `<div class="sentence-translation english-text">${translation}</div>` : ''}
      </div>
    `;
  }

  /**
   * Highlight verb in sentence with elegant styling
   * @private
   */
  _highlightVerb(sentence, verb) {
    // Handle conjugated forms intelligently
    const verbRoot = this._getVerbRoot(verb);
    const pattern = new RegExp(`\\b(${verb}|${verbRoot}\\w*)\\b`, 'gi');

    return sentence.replace(pattern, (match) => {
      return `<span class="verb-highlight" data-verb="${verb}">${match}</span>`;
    });
  }

  /**
   * Extract verb root for conjugation matching
   * @private
   */
  _getVerbRoot(verb) {
    // Remove -ar, -er, -ir endings
    return verb.replace(/(?:ar|er|ir)$/, '');
  }

  /**
   * Build metadata tags (region, formality, context)
   * @private
   */
  _buildMetadata(region, formality, context) {
    const tags = [];

    if (region) {
      const flag = this.regionalFlags[region.toLowerCase()] || '🌎';
      tags.push(`<span class="metadata-tag regional-tag" data-region="${region}">
        ${flag} ${this._formatRegionName(region)}
      </span>`);
    }

    if (formality) {
      const formalityData = this.formalityLevels[formality] || this.formalityLevels.neutral;
      tags.push(`<span class="metadata-tag formality-tag ${formalityData.class}">
        ${formalityData.icon} ${formalityData.label}
      </span>`);
    }

    if (context) {
      const contextData = this.contextMarkers[context] || { label: context, class: 'context-general' };
      tags.push(`<span class="metadata-tag context-tag ${contextData.class}" style="--tag-color: ${contextData.color}">
        ${contextData.label}
      </span>`);
    }

    return tags.length > 0 ? tags.join('') : null;
  }

  /**
   * Format region name for display
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
   * Format definition with nuanced layers
   * @param {Object} definition - Definition data
   * @returns {string} HTML formatted definition
   */
  formatDefinition(definition) {
    const {
      quick_gloss,
      nuanced_definition,
      full_context,
      etymology = null,
      usage_notes = null
    } = definition;

    return `
      <div class="definition-layered">
        <div class="definition-layer-1 always-visible">
          ${quick_gloss}
        </div>
        ${nuanced_definition ? `
          <div class="definition-layer-2 show-on-hover">
            <div class="layer-indicator">More detail</div>
            ${nuanced_definition}
          </div>
        ` : ''}
        ${full_context ? `
          <div class="definition-layer-3 show-on-click">
            <div class="layer-indicator">Full context</div>
            ${full_context}
            ${etymology ? `<div class="etymology-note">
              <span class="etymology-label">Etymology:</span> ${etymology}
            </div>` : ''}
            ${usage_notes ? `<div class="usage-notes">
              <span class="usage-label">Usage notes:</span> ${usage_notes}
            </div>` : ''}
          </div>
        ` : ''}
      </div>
    `;
  }

  /**
   * Format regional variation comparison
   * @param {Array} variations - Array of regional variations
   * @returns {string} HTML formatted comparison
   */
  formatRegionalComparison(variations) {
    return `
      <div class="regional-comparison">
        <h3 class="comparison-title">Regional Variations</h3>
        <div class="variations-grid">
          ${variations.map(v => `
            <div class="variation-item" data-region="${v.region}">
              <div class="variation-header">
                <span class="region-flag">${this.regionalFlags[v.region.toLowerCase()]}</span>
                <span class="region-name">${this._formatRegionName(v.region)}</span>
              </div>
              <div class="variation-verb spanish-text">${v.verb}</div>
              <div class="variation-usage">${v.usage_note}</div>
              ${v.example ? `
                <div class="variation-example">
                  "${v.example}"
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /**
   * Format usage intensity spectrum
   * @param {number} intensity - Intensity value (0-10)
   * @param {string} label - Label for the spectrum
   * @returns {string} HTML formatted spectrum
   */
  formatIntensitySpectrum(intensity, label = 'Usage Intensity') {
    const percentage = (intensity / 10) * 100;
    const intensityClass = intensity <= 3 ? 'low' : intensity <= 7 ? 'medium' : 'high';

    return `
      <div class="intensity-spectrum">
        <div class="spectrum-label">${label}</div>
        <div class="spectrum-bar">
          <div class="spectrum-fill ${intensityClass}" style="width: ${percentage}%">
            <span class="spectrum-value">${intensity}/10</span>
          </div>
        </div>
        <div class="spectrum-markers">
          <span class="marker marker-low">Subtle</span>
          <span class="marker marker-medium">Moderate</span>
          <span class="marker marker-high">Intense</span>
        </div>
      </div>
    `;
  }

  /**
   * Format cultural note callout
   * @param {string} note - Cultural note text
   * @param {string} type - Note type (cultural, linguistic, historical)
   * @returns {string} HTML formatted callout
   */
  formatCulturalNote(note, type = 'cultural') {
    const icons = {
      cultural: '🌍',
      linguistic: '📖',
      historical: '🕰️',
      etymological: '🔤'
    };

    return `
      <div class="cultural-note callout-${type}">
        <div class="note-header">
          <span class="note-icon">${icons[type] || '💡'}</span>
          <span class="note-type">${type.charAt(0).toUpperCase() + type.slice(1)} Note</span>
        </div>
        <div class="note-content">
          ${note}
        </div>
      </div>
    `;
  }

  /**
   * Format compare mode display (side-by-side synonyms)
   * @param {Array} synonyms - Array of synonym objects
   * @returns {string} HTML formatted comparison
   */
  formatCompareMode(synonyms) {
    return `
      <div class="compare-mode">
        <div class="compare-header">
          <h3>Compare Synonyms</h3>
          <span class="compare-count">${synonyms.length} variations</span>
        </div>
        <div class="compare-grid">
          ${synonyms.map((syn, index) => `
            <div class="compare-card" data-index="${index}">
              <div class="compare-verb spanish-text">${syn.verb}</div>
              <div class="compare-definition">${syn.quick_gloss}</div>
              ${syn.formality ? `
                <div class="compare-formality">
                  ${this.formalityLevels[syn.formality].icon}
                  ${this.formalityLevels[syn.formality].label}
                </div>
              ` : ''}
              ${syn.region ? `
                <div class="compare-region">
                  ${this.regionalFlags[syn.region.toLowerCase()]}
                  ${this._formatRegionName(syn.region)}
                </div>
              ` : ''}
              ${syn.example ? `
                <div class="compare-example">
                  ${this._highlightVerb(syn.example, syn.verb)}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}

// Export singleton instance
export const contentFormatter = new ContentFormatter();
