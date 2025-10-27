/**
 * DefinitionPanel Component
 * Sophisticated panel for displaying layered definitions with smooth transitions
 */

export class DefinitionPanel {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      expandable: true,
      showEtymology: true,
      showUsageNotes: true,
      animationDuration: 300,
      ...options
    };

    this.currentDefinition = null;
    this.currentLayer = 1;
    this.panel = null;
  }

  /**
   * Show definition in panel
   * @param {Object} definition - Definition data
   */
  show(definition) {
    this.currentDefinition = definition;

    if (!this.panel) {
      this.panel = this._createPanel();
      this.container.appendChild(this.panel);
    }

    this._updateContent(definition);
    this._animateIn();

    return this;
  }

  /**
   * Hide the panel
   */
  hide() {
    if (!this.panel) return;

    this._animateOut(() => {
      if (this.panel && this.panel.parentNode) {
        this.panel.parentNode.removeChild(this.panel);
      }
      this.panel = null;
      this.currentDefinition = null;
      this.currentLayer = 1;
    });

    return this;
  }

  /**
   * Create panel structure
   * @private
   */
  _createPanel() {
    const panel = document.createElement('div');
    panel.className = 'definition-panel';

    const header = document.createElement('div');
    header.className = 'panel-header';

    const title = document.createElement('h2');
    title.className = 'panel-title spanish-text';
    header.appendChild(title);

    const closeBtn = document.createElement('button');
    closeBtn.className = 'panel-close';
    closeBtn.innerHTML = '×';
    closeBtn.onclick = () => this.hide();
    header.appendChild(closeBtn);

    const content = document.createElement('div');
    content.className = 'panel-content';

    const layerContainer = document.createElement('div');
    layerContainer.className = 'panel-layers';
    content.appendChild(layerContainer);

    panel.appendChild(header);
    panel.appendChild(content);

    return panel;
  }

  /**
   * Update panel content
   * @private
   */
  _updateContent(definition) {
    const title = this.panel.querySelector('.panel-title');
    title.textContent = definition.verb || 'Definition';

    const layerContainer = this.panel.querySelector('.panel-layers');
    layerContainer.innerHTML = '';

    // Layer 1: Quick gloss
    const layer1 = this._createLayer1Content(definition);
    layerContainer.appendChild(layer1);

    // Layer 2: Nuanced definition
    if (definition.nuanced_definition) {
      const layer2 = this._createLayer2Content(definition);
      layerContainer.appendChild(layer2);
    }

    // Layer 3: Full context
    if (definition.full_context) {
      const layer3 = this._createLayer3Content(definition);
      layerContainer.appendChild(layer3);

      // Add layer navigation
      const nav = this._createLayerNavigation();
      layerContainer.appendChild(nav);
    }
  }

  /**
   * Create Layer 1 content
   * @private
   */
  _createLayer1Content(definition) {
    const layer = document.createElement('div');
    layer.className = 'definition-layer layer-1 active';
    layer.dataset.layer = '1';

    const indicator = document.createElement('div');
    indicator.className = 'layer-indicator';
    indicator.innerHTML = '<span class="indicator-icon">1</span> Quick Reference';

    const content = document.createElement('div');
    content.className = 'layer-content english-text';
    content.textContent = definition.quick_gloss || definition.definition;

    layer.appendChild(indicator);
    layer.appendChild(content);

    return layer;
  }

  /**
   * Create Layer 2 content
   * @private
   */
  _createLayer2Content(definition) {
    const layer = document.createElement('div');
    layer.className = 'definition-layer layer-2';
    layer.dataset.layer = '2';

    const indicator = document.createElement('div');
    indicator.className = 'layer-indicator';
    indicator.innerHTML = '<span class="indicator-icon">2</span> Nuanced Understanding';

    const content = document.createElement('div');
    content.className = 'layer-content';
    content.innerHTML = definition.nuanced_definition;

    layer.appendChild(indicator);
    layer.appendChild(content);

    return layer;
  }

  /**
   * Create Layer 3 content
   * @private
   */
  _createLayer3Content(definition) {
    const layer = document.createElement('div');
    layer.className = 'definition-layer layer-3';
    layer.dataset.layer = '3';

    const indicator = document.createElement('div');
    indicator.className = 'layer-indicator';
    indicator.innerHTML = '<span class="indicator-icon">3</span> Complete Context';

    const content = document.createElement('div');
    content.className = 'layer-content';

    // Full context
    const contextDiv = document.createElement('div');
    contextDiv.className = 'full-context-section';
    contextDiv.innerHTML = definition.full_context;
    content.appendChild(contextDiv);

    // Etymology
    if (this.options.showEtymology && definition.etymology) {
      const etymologyDiv = document.createElement('div');
      etymologyDiv.className = 'etymology-section';
      etymologyDiv.innerHTML = `
        <h4 class="section-title">
          <span class="section-icon">🔤</span> Etymology
        </h4>
        <p class="section-content">${definition.etymology}</p>
      `;
      content.appendChild(etymologyDiv);
    }

    // Usage notes
    if (this.options.showUsageNotes && definition.usage_notes) {
      const usageDiv = document.createElement('div');
      usageDiv.className = 'usage-notes-section';
      usageDiv.innerHTML = `
        <h4 class="section-title">
          <span class="section-icon">📝</span> Usage Notes
        </h4>
        <p class="section-content">${definition.usage_notes}</p>
      `;
      content.appendChild(usageDiv);
    }

    layer.appendChild(indicator);
    layer.appendChild(content);

    return layer;
  }

  /**
   * Create layer navigation
   * @private
   */
  _createLayerNavigation() {
    const nav = document.createElement('div');
    nav.className = 'layer-navigation';

    const layers = this.panel.querySelectorAll('.definition-layer');
    const navButtons = [];

    layers.forEach((layer, index) => {
      const btn = document.createElement('button');
      btn.className = `layer-nav-btn ${index === 0 ? 'active' : ''}`;
      btn.dataset.layer = index + 1;
      btn.innerHTML = `
        <span class="nav-number">${index + 1}</span>
        <span class="nav-label">${this._getLayerLabel(index + 1)}</span>
      `;

      btn.onclick = () => this.navigateToLayer(index + 1);
      navButtons.push(btn);
      nav.appendChild(btn);
    });

    return nav;
  }

  /**
   * Get layer label
   * @private
   */
  _getLayerLabel(layer) {
    const labels = {
      1: 'Quick',
      2: 'Detailed',
      3: 'Complete'
    };
    return labels[layer] || `Layer ${layer}`;
  }

  /**
   * Navigate to specific layer
   * @param {number} layer - Layer number (1-3)
   */
  navigateToLayer(layer) {
    if (layer === this.currentLayer) return;

    const layers = this.panel.querySelectorAll('.definition-layer');
    const navBtns = this.panel.querySelectorAll('.layer-nav-btn');

    // Deactivate current
    layers.forEach(l => l.classList.remove('active'));
    navBtns.forEach(btn => btn.classList.remove('active'));

    // Activate new
    const targetLayer = layers[layer - 1];
    const targetBtn = navBtns[layer - 1];

    if (targetLayer) {
      targetLayer.classList.add('active');
      this.currentLayer = layer;
    }

    if (targetBtn) {
      targetBtn.classList.add('active');
    }

    return this;
  }

  /**
   * Animate panel in
   * @private
   */
  _animateIn() {
    if (!this.panel) return;

    this.panel.style.opacity = '0';
    this.panel.style.transform = 'translateY(20px)';

    requestAnimationFrame(() => {
      this.panel.style.transition = `opacity ${this.options.animationDuration}ms ease, transform ${this.options.animationDuration}ms ease`;
      this.panel.style.opacity = '1';
      this.panel.style.transform = 'translateY(0)';
    });
  }

  /**
   * Animate panel out
   * @private
   */
  _animateOut(callback) {
    if (!this.panel) return;

    this.panel.style.opacity = '0';
    this.panel.style.transform = 'translateY(20px)';

    setTimeout(() => {
      if (callback) callback();
    }, this.options.animationDuration);
  }

  /**
   * Update definition
   * @param {Object} definition - New definition data
   */
  update(definition) {
    if (!this.panel) {
      return this.show(definition);
    }

    this._updateContent(definition);
    this.currentDefinition = definition;
    this.currentLayer = 1;

    return this;
  }

  /**
   * Destroy panel and cleanup
   */
  destroy() {
    this.hide();
    this.container = null;
    this.currentDefinition = null;
  }
}

export default DefinitionPanel;
