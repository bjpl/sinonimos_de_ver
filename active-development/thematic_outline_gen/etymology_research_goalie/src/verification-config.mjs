/**
 * Verification Configuration
 * Adjustable parameters for citation grounding, consistency checks, and confidence scoring
 */

export class VerificationConfig {
  constructor(options = {}) {
    // Citation Grounding Parameters
    this.citationGrounding = {
      minKeywordLength: options.minKeywordLength || 3,
      minKeywordOverlap: options.minKeywordOverlap || 0.3, // 30% keyword match
      maxClaimsToAnalyze: options.maxClaimsToAnalyze || 10,
      minClaimLength: options.minClaimLength || 20,
      verificationThreshold: options.verificationThreshold || 0.8, // 80% for high confidence
      ...options.citationGrounding
    };

    // Self-Consistency Parameters
    this.selfConsistency = {
      minSimilarity: options.minSimilarity || 0.3, // 30% keyword overlap
      consistencyThreshold: options.consistencyThreshold || 0.85, // 85% for high confidence
      minQueryGroupSize: options.minQueryGroupSize || 2,
      ...options.selfConsistency
    };

    // Anti-Hallucination Parameters
    this.hallucination = {
      vagueLanguageThreshold: options.vagueLanguageThreshold || 3, // Max vague phrases
      unsupportedClaimsThreshold: options.unsupportedClaimsThreshold || 0.3, // 30% max unsupported
      dateGapThreshold: options.dateGapThreshold || 1000, // Years
      lowRiskThreshold: options.lowRiskThreshold || 0.3,
      mediumRiskThreshold: options.mediumRiskThreshold || 0.6,
      // Risk weights
      noCitationsWeight: options.noCitationsWeight || 0.3,
      vagueLanguageWeight: options.vagueLanguageWeight || 0.2,
      unsupportedClaimsWeight: options.unsupportedClaimsWeight || 0.3,
      inconsistentFactsWeight: options.inconsistentFactsWeight || 0.2,
      ...options.hallucination
    };

    // Confidence Scoring Parameters
    this.confidence = {
      citationWeight: options.citationWeight || 0.4, // 40%
      qualityWeight: options.qualityWeight || 0.3, // 30%
      verificationWeight: options.verificationWeight || 0.3, // 30%
      minCitationsForMax: options.minCitationsForMax || 5,
      qualityLengthShort: options.qualityLengthShort || 500,
      qualityLengthLong: options.qualityLengthLong || 1000,
      minTechnicalTerms: options.minTechnicalTerms || 5,
      ...options.confidence
    };

    // Confidence Thresholds for Interpretation
    this.thresholds = {
      excellent: options.excellentThreshold || 0.8, // 80%+
      good: options.goodThreshold || 0.6, // 60-79%
      fair: options.fairThreshold || 0.4, // 40-59%
      // Below fair is "poor"
      ...options.thresholds
    };
  }

  /**
   * Get human-readable confidence level
   */
  getConfidenceLevel(score) {
    if (score >= this.thresholds.excellent) return 'excellent';
    if (score >= this.thresholds.good) return 'good';
    if (score >= this.thresholds.fair) return 'fair';
    return 'poor';
  }

  /**
   * Get hallucination risk level
   */
  getHallucinationRisk(score) {
    if (score < this.hallucination.lowRiskThreshold) return 'low';
    if (score < this.hallucination.mediumRiskThreshold) return 'medium';
    return 'high';
  }

  /**
   * Create preset configurations
   */
  static presets = {
    // Strict: High standards for academic research
    strict: {
      citationGrounding: {
        minKeywordOverlap: 0.4, // 40% match required
        verificationThreshold: 0.9 // 90% verification required
      },
      selfConsistency: {
        minSimilarity: 0.4,
        consistencyThreshold: 0.9
      },
      hallucination: {
        vagueLanguageThreshold: 2,
        unsupportedClaimsThreshold: 0.2,
        lowRiskThreshold: 0.2,
        mediumRiskThreshold: 0.5
      },
      thresholds: {
        excellent: 0.85,
        good: 0.7,
        fair: 0.5
      }
    },

    // Balanced: Default settings (current implementation)
    balanced: {
      citationGrounding: {
        minKeywordOverlap: 0.3,
        verificationThreshold: 0.8
      },
      selfConsistency: {
        minSimilarity: 0.3,
        consistencyThreshold: 0.85
      },
      hallucination: {
        vagueLanguageThreshold: 3,
        unsupportedClaimsThreshold: 0.3,
        lowRiskThreshold: 0.3,
        mediumRiskThreshold: 0.6
      },
      thresholds: {
        excellent: 0.8,
        good: 0.6,
        fair: 0.4
      }
    },

    // Lenient: More forgiving for exploratory research
    lenient: {
      citationGrounding: {
        minKeywordOverlap: 0.2, // 20% match
        verificationThreshold: 0.7 // 70% verification
      },
      selfConsistency: {
        minSimilarity: 0.2,
        consistencyThreshold: 0.75
      },
      hallucination: {
        vagueLanguageThreshold: 5,
        unsupportedClaimsThreshold: 0.4,
        lowRiskThreshold: 0.4,
        mediumRiskThreshold: 0.7
      },
      thresholds: {
        excellent: 0.75,
        good: 0.55,
        fair: 0.35
      }
    },

    // Fast: Minimal verification for quick results
    fast: {
      citationGrounding: {
        maxClaimsToAnalyze: 5,
        minKeywordOverlap: 0.25,
        verificationThreshold: 0.6
      },
      selfConsistency: {
        minSimilarity: 0.25,
        consistencyThreshold: 0.7
      },
      hallucination: {
        vagueLanguageThreshold: 4,
        unsupportedClaimsThreshold: 0.35,
        lowRiskThreshold: 0.35,
        mediumRiskThreshold: 0.65
      },
      confidence: {
        citationWeight: 0.5, // Prioritize citations
        qualityWeight: 0.25,
        verificationWeight: 0.25
      }
    },

    // Custom etymology: Optimized for etymology research
    etymology: {
      citationGrounding: {
        minKeywordOverlap: 0.35, // Language-specific terms important
        verificationThreshold: 0.85
      },
      selfConsistency: {
        minSimilarity: 0.35, // Technical terms should match
        consistencyThreshold: 0.85
      },
      confidence: {
        citationWeight: 0.35, // Balance all factors
        qualityWeight: 0.35, // Technical depth important
        verificationWeight: 0.3
      }
    }
  };

  /**
   * Load a preset configuration
   */
  static fromPreset(presetName) {
    const preset = VerificationConfig.presets[presetName];
    if (!preset) {
      throw new Error(`Unknown preset: ${presetName}. Available: ${Object.keys(VerificationConfig.presets).join(', ')}`);
    }
    return new VerificationConfig(preset);
  }

  /**
   * Load from JSON file
   */
  static fromFile(filepath) {
    const fs = require('fs');
    const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    return new VerificationConfig(data);
  }

  /**
   * Save configuration to JSON file
   */
  toFile(filepath) {
    const fs = require('fs');
    const config = {
      citationGrounding: this.citationGrounding,
      selfConsistency: this.selfConsistency,
      hallucination: this.hallucination,
      confidence: this.confidence,
      thresholds: this.thresholds
    };
    fs.writeFileSync(filepath, JSON.stringify(config, null, 2));
  }

  /**
   * Display current configuration
   */
  toString() {
    return `
Verification Configuration
==========================

Citation Grounding:
  - Minimum keyword overlap: ${(this.citationGrounding.minKeywordOverlap * 100).toFixed(0)}%
  - Verification threshold: ${(this.citationGrounding.verificationThreshold * 100).toFixed(0)}%
  - Max claims to analyze: ${this.citationGrounding.maxClaimsToAnalyze}

Self-Consistency:
  - Minimum similarity: ${(this.selfConsistency.minSimilarity * 100).toFixed(0)}%
  - Consistency threshold: ${(this.selfConsistency.consistencyThreshold * 100).toFixed(0)}%

Anti-Hallucination:
  - Vague language threshold: ${this.hallucination.vagueLanguageThreshold} phrases
  - Unsupported claims threshold: ${(this.hallucination.unsupportedClaimsThreshold * 100).toFixed(0)}%
  - Risk levels: low < ${(this.hallucination.lowRiskThreshold * 100).toFixed(0)}% < medium < ${(this.hallucination.mediumRiskThreshold * 100).toFixed(0)}% < high

Confidence Scoring:
  - Citation weight: ${(this.confidence.citationWeight * 100).toFixed(0)}%
  - Quality weight: ${(this.confidence.qualityWeight * 100).toFixed(0)}%
  - Verification weight: ${(this.confidence.verificationWeight * 100).toFixed(0)}%

Confidence Thresholds:
  - Excellent: ≥ ${(this.thresholds.excellent * 100).toFixed(0)}%
  - Good: ≥ ${(this.thresholds.good * 100).toFixed(0)}%
  - Fair: ≥ ${(this.thresholds.fair * 100).toFixed(0)}%
  - Poor: < ${(this.thresholds.fair * 100).toFixed(0)}%
`;
  }
}

export default VerificationConfig;
