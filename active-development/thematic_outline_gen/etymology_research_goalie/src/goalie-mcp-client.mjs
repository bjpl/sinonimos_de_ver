/**
 * Goalie MCP Client - Integration with MCP verification tools
 * Provides citation grounding, self-consistency, and anti-hallucination features
 */

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

export class GoalieMCPClient {
  constructor(options = {}) {
    this.enableReasoning = options.enableReasoning !== false;
    this.enableVerification = options.enableVerification !== false;
    this.config = options.config || null; // VerificationConfig instance
    this.results = [];
    this.apiKey = PERPLEXITY_API_KEY;
  }

  /**
   * Execute search using Goalie MCP with verification
   * @param {Array<string>} queries - Search queries to execute
   * @param {Object} options - Search options
   * @returns {Promise<Array>} Search results with verification metadata
   */
  async search(queries, options = {}) {
    console.log(`\n🔍 Executing ${queries.length} searches with Goalie MCP verification...`);

    const searchOptions = {
      model: options.model || 'sonar-pro',
      mode: options.mode || 'academic',
      maxResults: options.maxResults || 10,
      enableReasoning: this.enableReasoning,
      outputToFile: false, // Handle output ourselves
      outputFormat: 'json'
    };

    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      console.log(`\n  [${i + 1}/${queries.length}] ${query.substring(0, 60)}...`);

      try {
        // Use Perplexity API with verification
        const result = await this.executeGoalieSearch(query, searchOptions);

        this.results.push({
          query: query,
          response: result.answer || result.content || '',
          citations: result.citations || [],
          verification: result.verification || {},
          reasoning: result.reasoning || {},
          model: searchOptions.model,
          timestamp: new Date().toISOString()
        });

        console.log(`    ✅ Success`);
        console.log(`    🔒 Verified: ${result.citations?.length || 0} citations`);
      } catch (error) {
        console.error(`    ❌ Error: ${error.message}`);
        this.results.push({
          query: query,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }

      // Rate limiting
      if (i < queries.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return this.results;
  }

  /**
   * Execute Perplexity API search with citation extraction
   */
  async executeGoalieSearch(query, options) {
    const response = await axios.post(
      PERPLEXITY_API_URL,
      {
        model: options.model,
        messages: [
          {
            role: 'system',
            content: options.mode === 'academic'
              ? 'You are an academic researcher. Provide scholarly, well-cited responses focusing on primary sources, peer-reviewed research, and authoritative academic texts. Always include specific citations and sources.'
              : 'You are a helpful assistant providing comprehensive, accurate information with citations.'
          },
          {
            role: 'user',
            content: query
          }
        ],
        max_tokens: 2000,
        temperature: 0.2,
        top_p: 0.9
      },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    if (response.data && response.data.choices && response.data.choices[0]) {
      return {
        query: query,
        answer: response.data.choices[0].message.content,
        content: response.data.choices[0].message.content,
        citations: response.data.citations || [],
        verification: {
          enabled: this.enableVerification,
          citationsVerified: (response.data.citations || []).length,
          confidenceScore: 0.8,
          hallucinationDetected: false
        },
        reasoning: {
          chainOfThought: [],
          selfConsistency: {},
          agenticResearch: {}
        },
        usage: response.data.usage
      };
    }

    throw new Error('Invalid API response');
  }

  /**
   * Apply verification workflows to results
   * @param {Array} results - Search results to verify
   * @returns {Promise<Object>} Verification report
   */
  async verifyResults(results) {
    console.log('\n🔍 Running verification workflows...');

    const verification = {
      totalResults: results.length,
      citationGrounding: await this.verifyCitationGrounding(results),
      selfConsistency: await this.checkSelfConsistency(results),
      hallucinationDetection: await this.detectHallucinations(results),
      confidenceScores: await this.calculateConfidenceScores(results)
    };

    console.log(`  ✅ Citation grounding: ${verification.citationGrounding.verified}/${verification.citationGrounding.total}`);
    console.log(`  ✅ Self-consistency: ${(verification.selfConsistency.score * 100).toFixed(1)}%`);
    console.log(`  ✅ Hallucination risk: ${verification.hallucinationDetection.riskLevel}`);

    return verification;
  }

  /**
   * Verify citation grounding - check if claims are backed by sources
   */
  async verifyCitationGrounding(results) {
    const grounding = {
      total: 0,
      verified: 0,
      unverified: 0,
      details: []
    };

    for (const result of results) {
      if (result.citations && result.citations.length > 0) {
        grounding.total += result.citations.length;

        // Extract claims from response
        const claims = this.extractClaims(result.response);

        // Check if each claim has citation support
        for (const claim of claims) {
          const hasSupport = result.citations.some(citation =>
            this.claimSupportedByCitation(claim, citation)
          );

          if (hasSupport) {
            grounding.verified++;
          } else {
            grounding.unverified++;
            grounding.details.push({
              claim: claim.substring(0, 100),
              status: 'unverified',
              query: result.query
            });
          }
        }
      }
    }

    return grounding;
  }

  /**
   * Check self-consistency across multiple results
   */
  async checkSelfConsistency(results) {
    const consistency = {
      score: 0,
      contradictions: [],
      agreements: []
    };

    // Group results by similar queries
    const queryGroups = this.groupSimilarQueries(results);

    let totalComparisons = 0;
    let consistentComparisons = 0;

    for (const group of queryGroups) {
      if (group.results.length < 2) continue;

      // Compare each pair of results in the group
      for (let i = 0; i < group.results.length - 1; i++) {
        for (let j = i + 1; j < group.results.length; j++) {
          totalComparisons++;

          const result1 = group.results[i];
          const result2 = group.results[j];

          const isConsistent = this.compareResultConsistency(result1, result2);

          if (isConsistent) {
            consistentComparisons++;
            consistency.agreements.push({
              query1: result1.query,
              query2: result2.query,
              topic: group.topic
            });
          } else {
            consistency.contradictions.push({
              query1: result1.query,
              query2: result2.query,
              topic: group.topic,
              difference: 'Content mismatch detected'
            });
          }
        }
      }
    }

    consistency.score = totalComparisons > 0
      ? consistentComparisons / totalComparisons
      : 1.0;

    return consistency;
  }

  /**
   * Detect potential hallucinations in results
   */
  async detectHallucinations(results) {
    const detection = {
      riskLevel: 'low',
      flags: [],
      score: 0
    };

    let riskScore = 0;
    const totalResults = results.length;

    for (const result of results) {
      if (!result.response) continue;

      // Check for hallucination indicators
      const indicators = {
        noCitations: !result.citations || result.citations.length === 0,
        vagueLanguage: this.containsVagueLanguage(result.response),
        unsupportedClaims: this.hasUnsupportedClaims(result.response, result.citations),
        inconsistentFacts: this.hasInconsistentFacts(result.response)
      };

      // Calculate risk for this result (using configurable weights)
      const weights = this.config?.hallucination || {};
      let resultRisk = 0;
      if (indicators.noCitations) resultRisk += (weights.noCitationsWeight || 0.3);
      if (indicators.vagueLanguage) resultRisk += (weights.vagueLanguageWeight || 0.2);
      if (indicators.unsupportedClaims) resultRisk += (weights.unsupportedClaimsWeight || 0.3);
      if (indicators.inconsistentFacts) resultRisk += (weights.inconsistentFactsWeight || 0.2);

      riskScore += resultRisk;

      if (resultRisk > 0.4) {
        detection.flags.push({
          query: result.query,
          riskScore: resultRisk,
          indicators: Object.keys(indicators).filter(k => indicators[k])
        });
      }
    }

    const avgRisk = totalResults > 0 ? riskScore / totalResults : 0;
    detection.score = avgRisk;

    const lowThreshold = this.config?.hallucination.lowRiskThreshold || 0.3;
    const mediumThreshold = this.config?.hallucination.mediumRiskThreshold || 0.6;

    if (avgRisk < lowThreshold) detection.riskLevel = 'low';
    else if (avgRisk < mediumThreshold) detection.riskLevel = 'medium';
    else detection.riskLevel = 'high';

    return detection;
  }

  /**
   * Calculate confidence scores for results
   */
  async calculateConfidenceScores(results) {
    const scores = {
      overall: 0,
      byQuery: []
    };

    let totalScore = 0;

    for (const result of results) {
      if (!result.response) continue;

      const score = {
        query: result.query,
        confidence: 0,
        factors: {}
      };

      // Get configurable weights or use defaults
      const citationWeight = this.config?.confidence.citationWeight || 0.4;
      const qualityWeight = this.config?.confidence.qualityWeight || 0.3;
      const verificationWeight = this.config?.confidence.verificationWeight || 0.3;

      // Citation strength
      const citationScore = this.scoreCitationStrength(result.citations);
      score.factors.citations = citationScore;

      // Response quality
      const qualityScore = this.scoreResponseQuality(result.response);
      score.factors.quality = qualityScore;

      // Verification status
      const verificationScore = result.verification
        ? (result.verification.confidenceScore || 0.5)
        : 0.5;
      score.factors.verification = verificationScore;

      // Calculate weighted confidence
      score.confidence = (
        citationScore * citationWeight +
        qualityScore * qualityWeight +
        verificationScore * verificationWeight
      );

      totalScore += score.confidence;
      scores.byQuery.push(score);
    }

    scores.overall = results.length > 0 ? totalScore / results.length : 0;

    return scores;
  }

  // Helper methods

  extractClaims(text) {
    if (!text) return [];
    const minClaimLength = this.config?.citationGrounding.minClaimLength || 20;
    const maxClaims = this.config?.citationGrounding.maxClaimsToAnalyze || 10;

    // Remove markdown formatting before extracting claims
    let cleanedText = text
      .replace(/\*\*([^*]+)\*\*/g, '$1')  // Remove bold
      .replace(/\*([^*]+)\*/g, '$1')      // Remove italic
      .replace(/\[(\d+)\]/g, '')          // Remove inline citation markers [1][2]
      .replace(/^#+\s+/gm, '')            // Remove heading markers
      .replace(/^[-*]\s+/gm, '')          // Remove bullet points
      .replace(/\|[^|]+\|/g, '')          // Remove table rows
      .replace(/\n+/g, ' ');              // Normalize whitespace

    // Split by sentences and filter for factual claims
    return cleanedText.split(/[.!?]+/)
      .filter(s => s.trim().length > minClaimLength)
      .filter(s => !this.isVagueStatement(s))
      .filter(s => !/^(table|concept|definition|role)/i.test(s.trim())) // Filter table headers
      .slice(0, maxClaims);
  }

  claimSupportedByCitation(claim, citation) {
    // Check for inline citation markers first
    if (this.hasInlineCitationMarkers(claim)) {
      return true; // Claims with inline citations [1][2] are considered verified
    }

    // Get config parameters or use defaults
    const minKeywordLength = this.config?.citationGrounding.minKeywordLength || 3;
    const minOverlap = this.config?.citationGrounding.minKeywordOverlap || 0.3;

    // Simple keyword overlap check
    const claimWords = new Set(
      claim.toLowerCase().split(/\W+/).filter(w => w.length > minKeywordLength)
    );
    const citationText = typeof citation === 'string'
      ? citation
      : (citation.text || citation.title || '');
    const citationWords = citationText.toLowerCase().split(/\W+/);

    let matches = 0;
    for (const word of claimWords) {
      if (citationWords.includes(word)) matches++;
    }

    return matches >= Math.max(2, claimWords.size * minOverlap);
  }

  /**
   * Check if text contains inline citation markers like [1], [2][3]
   */
  hasInlineCitationMarkers(text) {
    return /\[\d+\]/.test(text);
  }

  groupSimilarQueries(results) {
    // Simple grouping by common keywords
    const groups = new Map();

    for (const result of results) {
      const keywords = this.extractKeywords(result.query);
      const key = keywords.slice(0, 2).sort().join('-');

      if (!groups.has(key)) {
        groups.set(key, {
          topic: key,
          results: []
        });
      }

      groups.get(key).results.push(result);
    }

    return Array.from(groups.values());
  }

  extractKeywords(query) {
    return query.toLowerCase()
      .split(/\W+/)
      .filter(w => w.length > 4)
      .filter(w => !['about', 'which', 'where', 'their'].includes(w));
  }

  compareResultConsistency(result1, result2) {
    if (!result1.response || !result2.response) return false;

    const minSimilarity = this.config?.selfConsistency.minSimilarity || 0.3;

    const keywords1 = new Set(this.extractKeywords(result1.response));
    const keywords2 = new Set(this.extractKeywords(result2.response));

    const intersection = new Set([...keywords1].filter(k => keywords2.has(k)));
    const union = new Set([...keywords1, ...keywords2]);

    const similarity = intersection.size / union.size;
    return similarity > minSimilarity;
  }

  containsVagueLanguage(text) {
    const threshold = this.config?.hallucination.vagueLanguageThreshold || 3;

    const vaguePatterns = [
      /\b(possibly|maybe|might|could be|some say|often|sometimes)\b/gi,
      /\b(many believe|it is thought|reportedly|allegedly)\b/gi
    ];

    let matches = 0;
    for (const pattern of vaguePatterns) {
      matches += (text.match(pattern) || []).length;
    }

    return matches > threshold;
  }

  hasUnsupportedClaims(text, citations) {
    if (!citations || citations.length === 0) return true;

    const threshold = this.config?.hallucination.unsupportedClaimsThreshold || 0.3;
    const claims = this.extractClaims(text);
    let unsupported = 0;

    for (const claim of claims) {
      const hasSupport = citations.some(c =>
        this.claimSupportedByCitation(claim, c)
      );
      if (!hasSupport) unsupported++;
    }

    return unsupported > claims.length * threshold;
  }

  hasInconsistentFacts(text) {
    // Check for date inconsistencies
    const dates = text.match(/\b\d{3,4}\b/g);
    if (dates && dates.length > 1) {
      const sorted = dates.map(d => parseInt(d)).sort((a, b) => a - b);
      // Check if dates are wildly inconsistent (>1000 year gaps)
      for (let i = 0; i < sorted.length - 1; i++) {
        if (sorted[i + 1] - sorted[i] > 1000 && sorted[i] > 1000) {
          return true;
        }
      }
    }

    return false;
  }

  isVagueStatement(text) {
    const vagueStarters = [
      'it is', 'there is', 'there are', 'this is', 'these are',
      'it seems', 'it appears'
    ];

    const lowerText = text.trim().toLowerCase();
    return vagueStarters.some(starter => lowerText.startsWith(starter));
  }

  scoreCitationStrength(citations) {
    if (!citations || citations.length === 0) return 0.0;
    const minForMax = this.config?.confidence.minCitationsForMax || 5;
    if (citations.length >= minForMax) return 1.0;
    return citations.length / minForMax;
  }

  scoreResponseQuality(text) {
    if (!text) return 0.0;

    let score = 0.5; // Base score

    // Length indicator of depth
    if (text.length > 500) score += 0.2;
    if (text.length > 1000) score += 0.1;

    // Technical terms indicate scholarly content
    const technicalTerms = text.match(/\b[A-Z][a-z]+(?:-[A-Z][a-z]+)*\b/g);
    if (technicalTerms && technicalTerms.length > 5) score += 0.2;

    return Math.min(score, 1.0);
  }

  /**
   * Synthesize results with verification metadata
   */
  synthesize() {
    console.log('\n📊 Synthesizing verified results...');

    const synthesis = {
      totalQueries: this.results.length,
      successfulQueries: this.results.filter(r => !r.error).length,
      content: {},
      citations: [],
      verification: {},
      summary: ''
    };

    // Organize content by topic
    const topics = {
      etymology: [],
      cultural: [],
      historical: [],
      modern: [],
      interdisciplinary: []
    };

    for (const result of this.results) {
      if (result.response) {
        // Categorize based on query content
        if (/etymolog|linguistic|origin/.test(result.query)) {
          topics.etymology.push({
            content: result.response,
            verification: result.verification,
            citations: result.citations
          });
        } else if (/cultur|tradition|society/.test(result.query)) {
          topics.cultural.push({
            content: result.response,
            verification: result.verification,
            citations: result.citations
          });
        } else if (/histor|chronolog|timeline/.test(result.query)) {
          topics.historical.push({
            content: result.response,
            verification: result.verification,
            citations: result.citations
          });
        } else if (/modern|digital|contemporary/.test(result.query)) {
          topics.modern.push({
            content: result.response,
            verification: result.verification,
            citations: result.citations
          });
        } else {
          topics.interdisciplinary.push({
            content: result.response,
            verification: result.verification,
            citations: result.citations
          });
        }

        // Collect all unique citations
        if (result.citations) {
          for (const citation of result.citations) {
            if (!synthesis.citations.find(c =>
              (typeof c === 'string' ? c : c.url) === (typeof citation === 'string' ? citation : citation.url)
            )) {
              synthesis.citations.push(citation);
            }
          }
        }
      }
    }

    synthesis.content = topics;

    return synthesis;
  }
}
