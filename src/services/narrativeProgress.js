/**
 * NarrativeProgress Service
 * Tracks user progress through narrative experiences using LocalStorage
 */

class NarrativeProgressTracker {
  constructor() {
    this.storageKey = 'sinonimos_narrative_progress';
    this.data = this._load();
  }

  /**
   * Mark a narrative part as completed
   */
  markPartComplete(verb, partIndex) {
    if (!this.data[verb]) {
      this.data[verb] = {
        startedAt: Date.now(),
        completedParts: [],
        lastVisited: Date.now(),
        totalTime: 0
      };
    }

    if (!this.data[verb].completedParts.includes(partIndex)) {
      this.data[verb].completedParts.push(partIndex);
      this.data[verb].completedParts.sort((a, b) => a - b);
    }

    this.data[verb].lastVisited = Date.now();
    this._save();

    return this.data[verb];
  }

  /**
   * Get progress for a specific verb
   */
  getProgress(verb) {
    return this.data[verb] || null;
  }

  /**
   * Check if a specific part is completed
   */
  isPartCompleted(verb, partIndex) {
    const progress = this.data[verb];
    return progress && progress.completedParts.includes(partIndex);
  }

  /**
   * Get completion percentage for a verb
   */
  getCompletionPercentage(verb, totalParts) {
    const progress = this.data[verb];
    if (!progress || !totalParts) return 0;

    return Math.round((progress.completedParts.length / totalParts) * 100);
  }

  /**
   * Check if narrative is fully completed
   */
  isNarrativeComplete(verb, totalParts) {
    const progress = this.data[verb];
    if (!progress) return false;

    return progress.completedParts.length === totalParts;
  }

  /**
   * Get all progress data
   */
  getAllProgress() {
    return { ...this.data };
  }

  /**
   * Get verbs that have been started
   */
  getStartedVerbs() {
    return Object.keys(this.data);
  }

  /**
   * Get completed verbs
   */
  getCompletedVerbs(verbsWithParts) {
    return Object.keys(this.data).filter(verb => {
      const totalParts = verbsWithParts[verb];
      return totalParts && this.isNarrativeComplete(verb, totalParts);
    });
  }

  /**
   * Reset progress for a specific verb
   */
  resetProgress(verb) {
    delete this.data[verb];
    this._save();
  }

  /**
   * Reset all progress
   */
  resetAllProgress() {
    this.data = {};
    this._save();
  }

  /**
   * Update total time spent
   */
  updateTimeSpent(verb, additionalTime) {
    if (!this.data[verb]) {
      this.markPartComplete(verb, 0);
    }

    this.data[verb].totalTime = (this.data[verb].totalTime || 0) + additionalTime;
    this._save();
  }

  /**
   * Get statistics
   */
  getStatistics() {
    const verbs = Object.keys(this.data);
    const totalTime = verbs.reduce((sum, verb) => {
      return sum + (this.data[verb].totalTime || 0);
    }, 0);

    return {
      totalNarrativesStarted: verbs.length,
      totalPartsCompleted: verbs.reduce((sum, verb) => {
        return sum + (this.data[verb].completedParts?.length || 0);
      }, 0),
      totalTimeSpent: totalTime,
      lastActivity: Math.max(...verbs.map(verb => this.data[verb].lastVisited || 0))
    };
  }

  /**
   * Export progress data
   */
  exportProgress() {
    return JSON.stringify(this.data, null, 2);
  }

  /**
   * Import progress data
   */
  importProgress(jsonData) {
    try {
      const imported = JSON.parse(jsonData);
      this.data = imported;
      this._save();
      return true;
    } catch (error) {
      console.error('Failed to import progress:', error);
      return false;
    }
  }

  /**
   * Load progress from localStorage
   * @private
   */
  _load() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to load narrative progress:', error);
      return {};
    }
  }

  /**
   * Save progress to localStorage
   * @private
   */
  _save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (error) {
      console.error('Failed to save narrative progress:', error);
    }
  }
}

// Create singleton instance
export const narrativeProgress = new NarrativeProgressTracker();

export default narrativeProgress;
