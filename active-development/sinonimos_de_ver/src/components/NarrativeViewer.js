/**
 * NarrativeViewer Component
 * Full-screen immersive narrative experience for literary synonyms
 */

import { narrativeProgress } from '../services/narrativeProgress.js';

export class NarrativeViewer {
  constructor(synonymData, options = {}) {
    this.data = synonymData;
    this.narrative = synonymData.narrativeExperience;
    this.options = {
      showProgress: true,
      enableHighlighting: true,
      trackCompletion: true,
      ...options
    };

    this.currentPart = 0;
    this.element = null;
    this.progress = this.options.trackCompletion
      ? narrativeProgress.getProgress(this.data.verb)
      : null;

    // Audio state
    this.currentAudio = null;
    this.currentPlayingPart = null;
  }

  /**
   * Render the narrative viewer
   */
  render() {
    this.element = document.createElement('div');
    this.element.className = 'narrative-viewer';

    this.element.innerHTML = `
      <div class="narrative-backdrop"></div>
      <div class="narrative-container">
        <div class="narrative-header">
          <button class="narrative-close" aria-label="Cerrar narrativa">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          <div class="narrative-title-section">
            <h1 class="narrative-title">${this.narrative.title}</h1>
            <p class="narrative-verb-label">Explorando: <strong>${this.data.verb}</strong></p>
          </div>
        </div>

        <div class="narrative-body">
          <aside class="narrative-sidebar">
            <div class="narrative-toc">
              <h3 class="toc-title">Capítulos</h3>
              <div class="toc-items">
                ${this._renderTOC()}
              </div>
            </div>
            ${this.options.showProgress ? this._renderProgressSection() : ''}
          </aside>

          <main class="narrative-content">
            <div class="narrative-parts">
              ${this._renderParts()}
            </div>

            <div class="narrative-note">
              <div class="note-icon">📚</div>
              <div class="note-content">
                <h4 class="note-title">Nota Literaria</h4>
                <p class="note-text">${this.narrative.literaryNote}</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    `;

    this._attachEventHandlers();
    this._highlightCurrentPart();

    return this.element;
  }

  /**
   * Render table of contents
   * @private
   */
  _renderTOC() {
    return this.narrative.parts.map((part, index) => {
      const isCompleted = this.progress && this.progress.completedParts?.includes(index);
      const isCurrent = index === this.currentPart;

      return `
        <div class="toc-item ${isCurrent ? 'active' : ''} ${isCompleted ? 'completed' : ''}"
             data-part="${index}"
             role="button"
             tabindex="0"
             aria-label="Ir a Parte ${index + 1}"
             aria-current="${isCurrent ? 'true' : 'false'}">
          <div class="toc-number">${index + 1}</div>
          <div class="toc-label">
            <span>Parte ${index + 1}</span>
            ${isCompleted ? '<span class="toc-check">✓</span>' : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Render progress section
   * @private
   */
  _renderProgressSection() {
    const completedCount = this.progress?.completedParts?.length || 0;
    const totalParts = this.narrative.parts.length;
    const percentage = totalParts > 0 ? Math.round((completedCount / totalParts) * 100) : 0;

    return `
      <div class="narrative-progress-section">
        <h3 class="progress-title">Tu Progreso</h3>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${percentage}%"></div>
        </div>
        <p class="progress-text">${completedCount} de ${totalParts} partes leídas</p>
      </div>
    `;
  }

  /**
   * Render narrative parts
   * @private
   */
  _renderParts() {
    return this.narrative.parts.map((part, index) => {
      const isActive = index === this.currentPart;
      const highlightedText = this.options.enableHighlighting
        ? this._highlightVerb(part)
        : part;

      // Get audio file for this part
      const audioFile = this._getPartAudioFile(index);

      return `
        <div class="narrative-part ${isActive ? 'active' : ''}" data-part="${index}">
          <div class="part-header">
            <div class="part-number">Parte ${index + 1}</div>
            ${audioFile ? `
              <div class="audio-controls" data-part="${index}">
                <button class="audio-btn audio-play"
                        data-audio="${audioFile}"
                        data-part="${index}"
                        data-action="play"
                        aria-label="Reproducir narración"
                        title="Reproducir">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </button>
                <button class="audio-btn audio-pause"
                        data-audio="${audioFile}"
                        data-part="${index}"
                        data-action="pause"
                        aria-label="Pausar narración"
                        title="Pausar"
                        style="display: none;">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                </button>
                <button class="audio-btn audio-restart"
                        data-audio="${audioFile}"
                        data-part="${index}"
                        data-action="restart"
                        aria-label="Reiniciar narración"
                        title="Reiniciar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                    <path d="M21 3v5h-5"></path>
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                    <path d="M3 21v-5h5"></path>
                  </svg>
                </button>
              </div>
            ` : ''}
          </div>
          <p class="part-text">${highlightedText}</p>
        </div>
      `;
    }).join('');
  }

  /**
   * Get audio file path for narrative part
   * @private
   */
  _getPartAudioFile(partIndex) {
    // Check if audio metadata is loaded globally
    if (typeof window.audioMetadata === 'undefined') return null;

    const narrativeAudio = window.audioMetadata.narratives?.[this.data.verb];
    if (!narrativeAudio) return null;

    const partAudio = narrativeAudio.parts?.[partIndex];
    return partAudio ? partAudio.file : null;
  }

  /**
   * Highlight verb in text
   * @private
   */
  _highlightVerb(text) {
    const verb = this.data.verb;
    const verbRoot = verb.substring(0, verb.length - 2);
    const regex = new RegExp(`\\b(${verbRoot}\\w*)\\b`, 'gi');

    return text.replace(regex, (match) => {
      return `<span class="highlighted-verb" data-verb="${verb}" title="Click para ver definición">${match}</span>`;
    });
  }

  /**
   * Attach event handlers
   * @private
   */
  _attachEventHandlers() {
    const closeBtn = this.element.querySelector('.narrative-close');
    const backdrop = this.element.querySelector('.narrative-backdrop');

    closeBtn.onclick = () => this.close();
    backdrop.onclick = () => this.close();

    const tocItems = this.element.querySelectorAll('.toc-item');
    tocItems.forEach(item => {
      item.onclick = () => {
        const partIndex = parseInt(item.dataset.part);
        this.goToPart(partIndex);
      };
    });

    const highlightedVerbs = this.element.querySelectorAll('.highlighted-verb');
    highlightedVerbs.forEach(span => {
      span.onclick = (e) => {
        e.stopPropagation();
        this._showVerbTooltip(span);
      };
    });

    // Make narrative parts clickable
    const narrativeParts = this.element.querySelectorAll('.narrative-part');
    narrativeParts.forEach((part, index) => {
      part.onclick = (e) => {
        // Don't trigger if clicking audio buttons or highlighted verbs
        if (e.target.closest('.audio-btn') || e.target.closest('.highlighted-verb')) {
          return;
        }
        this.goToPart(index);
      };
      // Add cursor pointer to show they're clickable
      part.style.cursor = 'pointer';
    });

    // Audio control buttons for narrative parts
    const audioButtons = this.element.querySelectorAll('.audio-btn');
    audioButtons.forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        const audioFile = btn.dataset.audio;
        const partIndex = parseInt(btn.dataset.part);

        if (action === 'play') {
          this._playPartAudio(audioFile, partIndex);
        } else if (action === 'pause') {
          this._pausePartAudio(partIndex);
        } else if (action === 'restart') {
          this._restartPartAudio(audioFile, partIndex);
        }
      };
    });

    this._keyboardHandler = this._handleKeyboard.bind(this);
    document.addEventListener('keydown', this._keyboardHandler);
  }

  /**
   * Play narrative part audio
   * @private
   */
  _playPartAudio(audioFile, partIndex) {
    // Stop any currently playing audio
    if (this.currentAudio) {
      this.currentAudio.pause();
      this._updateAudioControls(this.currentPlayingPart, 'stopped');
    }

    // Create new audio
    this.currentAudio = new Audio(audioFile);
    this.currentPlayingPart = partIndex;

    // Update UI to show pause button
    this._updateAudioControls(partIndex, 'playing');

    // Handle audio end
    this.currentAudio.onended = () => {
      this._updateAudioControls(partIndex, 'stopped');
      this.currentAudio = null;
      this.currentPlayingPart = null;
    };

    // Play
    this.currentAudio.play().catch(err => {
      console.error('Audio playback failed:', err);
      this._updateAudioControls(partIndex, 'stopped');
    });
  }

  /**
   * Pause narrative part audio
   * @private
   */
  _pausePartAudio(partIndex) {
    if (this.currentAudio && this.currentPlayingPart === partIndex) {
      this.currentAudio.pause();
      this._updateAudioControls(partIndex, 'paused');
    }
  }

  /**
   * Restart narrative part audio
   * @private
   */
  _restartPartAudio(audioFile, partIndex) {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }
    this._playPartAudio(audioFile, partIndex);
  }

  /**
   * Update audio control button visibility
   * @private
   */
  _updateAudioControls(partIndex, state) {
    const controls = this.element.querySelector(`.audio-controls[data-part="${partIndex}"]`);
    if (!controls) return;

    const playBtn = controls.querySelector('.audio-play');
    const pauseBtn = controls.querySelector('.audio-pause');
    const restartBtn = controls.querySelector('.audio-restart');

    if (state === 'playing') {
      playBtn.style.display = 'none';
      pauseBtn.style.display = 'flex';
      restartBtn.classList.add('active');
      controls.classList.add('playing');
    } else if (state === 'paused') {
      playBtn.style.display = 'flex';
      pauseBtn.style.display = 'none';
      restartBtn.classList.add('active');
      controls.classList.remove('playing');
    } else { // stopped
      playBtn.style.display = 'flex';
      pauseBtn.style.display = 'none';
      restartBtn.classList.remove('active');
      controls.classList.remove('playing');
    }
  }

  /**
   * Handle keyboard navigation
   * @private
   */
  _handleKeyboard(e) {
    if (!this.element || !document.body.contains(this.element)) return;

    if (e.key === 'Escape') {
      this.close();
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      this.nextPart();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      this.prevPart();
    } else if (e.key >= '1' && e.key <= '9') {
      // Number keys 1-3 jump to parts
      const partIndex = parseInt(e.key) - 1;
      if (partIndex < this.narrative.parts.length) {
        this.goToPart(partIndex);
      }
    }
  }

  /**
   * Show verb tooltip
   * @private
   */
  _showVerbTooltip(element) {
    const existingTooltip = this.element.querySelector('.verb-tooltip');
    if (existingTooltip) existingTooltip.remove();

    const tooltip = document.createElement('div');
    tooltip.className = 'verb-tooltip';
    tooltip.innerHTML = `
      <div class="tooltip-header">
        <strong>${this.data.verb}</strong>
        <button class="tooltip-close">&times;</button>
      </div>
      <p class="tooltip-definition">${this.data.definition}</p>
    `;

    const rect = element.getBoundingClientRect();
    tooltip.style.position = 'absolute';
    tooltip.style.top = `${rect.bottom + 10}px`;
    tooltip.style.left = `${rect.left}px`;

    this.element.appendChild(tooltip);

    const closeBtn = tooltip.querySelector('.tooltip-close');
    closeBtn.onclick = () => tooltip.remove();

    setTimeout(() => {
      if (tooltip.parentElement) tooltip.remove();
    }, 5000);
  }

  /**
   * Navigate to specific part
   */
  goToPart(index) {
    if (index < 0 || index >= this.narrative.parts.length) return;

    if (this.options.trackCompletion && this.currentPart !== index) {
      narrativeProgress.markPartComplete(this.data.verb, this.currentPart);
    }

    this.currentPart = index;
    this._highlightCurrentPart();
    this._updateNavigation();
    this._updateTOC();
    this._updateProgress();

    const activePart = this.element.querySelector('.narrative-part.active');
    if (activePart) {
      activePart.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  nextPart() {
    if (this.currentPart < this.narrative.parts.length - 1) {
      this.goToPart(this.currentPart + 1);
    }
  }

  prevPart() {
    if (this.currentPart > 0) {
      this.goToPart(this.currentPart - 1);
    }
  }

  _highlightCurrentPart() {
    const parts = this.element.querySelectorAll('.narrative-part');
    parts.forEach((part, index) => {
      if (index === this.currentPart) {
        part.classList.add('active');
      } else {
        part.classList.remove('active');
      }
    });
  }

  _updateNavigation() {
    // Navigation via TOC only - no separate nav buttons
  }

  _updateTOC() {
    const tocItems = this.element.querySelectorAll('.toc-item');
    tocItems.forEach((item, index) => {
      if (index === this.currentPart) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  _updateProgress() {
    if (!this.options.showProgress) return;

    const progressSection = this.element.querySelector('.narrative-progress-section');
    if (!progressSection) return;

    this.progress = narrativeProgress.getProgress(this.data.verb);
    const completedCount = this.progress?.completedParts?.length || 0;
    const totalParts = this.narrative.parts.length;
    const percentage = totalParts > 0 ? Math.round((completedCount / totalParts) * 100) : 0;

    const progressFill = progressSection.querySelector('.progress-fill');
    const progressText = progressSection.querySelector('.progress-text');

    if (progressFill) progressFill.style.width = `${percentage}%`;
    if (progressText) progressText.textContent = `${completedCount} de ${totalParts} partes leídas`;
  }

  close() {
    // Stop any playing audio
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }

    if (this.options.trackCompletion) {
      narrativeProgress.markPartComplete(this.data.verb, this.currentPart);
    }

    this.element.classList.add('closing');

    setTimeout(() => {
      if (this.element && this.element.parentElement) {
        this.element.parentElement.removeChild(this.element);
      }

      document.removeEventListener('keydown', this._keyboardHandler);
      document.body.style.overflow = '';

      if (typeof this.options.onClose === 'function') {
        this.options.onClose();
      }
    }, 300);
  }

  open() {
    document.body.appendChild(this.element);
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      this.element.classList.add('active');
    }, 10);

    return this;
  }
}

export default NarrativeViewer;
