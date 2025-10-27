# Verification Configuration Examples

## Overview

GOALIE-X verification parameters can be adjusted to match your research needs. This guide provides practical examples for different scenarios.

## Quick Reference

### Available Presets

- **strict** - Academic research requiring high confidence (90%+ thresholds)
- **balanced** - Default settings (80%+ thresholds)
- **lenient** - Exploratory research (70%+ thresholds)
- **fast** - Quick research with minimal verification
- **etymology** - Optimized for etymology and linguistic research

### CLI Options

```bash
--preset <name>              # Use a preset configuration
--config <file>              # Load custom config from JSON
--min-overlap <percent>      # Citation matching threshold (0-100)
--verification-threshold <percent>  # Citation verification goal (0-100)
--consistency-threshold <percent>   # Self-consistency goal (0-100)
--show-config                # Display current configuration
```

## Usage Examples

### Example 1: Strict Academic Research

For peer-reviewed publications requiring maximum verification:

```bash
npm run search "autodidact etymology" --preset strict -n 7
```

**Configuration:**
- Citation overlap: 40% (vs 30% default)
- Verification threshold: 90% (vs 80% default)
- Consistency threshold: 90% (vs 85% default)
- Risk thresholds: Lower (more sensitive)

**When to use:**
- Academic papers
- Thesis research
- Scholarly publications
- Citations in formal work

### Example 2: Etymology Research (Default)

Optimized for linguistic and etymology research:

```bash
npm run search "Greek Latin etymology" --preset etymology
```

**Configuration:**
- Citation overlap: 35% (technical terms weighted)
- Verification threshold: 85%
- Balanced scoring (35% citations, 35% quality, 30% verification)

**When to use:**
- Etymology research
- Linguistic analysis
- Cross-language comparison
- Historical language study

### Example 3: Exploratory Research

For initial research or broad topic exploration:

```bash
npm run search "self-taught traditions" --preset lenient -n 5
```

**Configuration:**
- Citation overlap: 20% (more forgiving)
- Verification threshold: 70%
- Higher vague language tolerance

**When to use:**
- Initial topic exploration
- Brainstorming
- Broad overviews
- Preliminary research

### Example 4: Quick Research

For fast results with basic verification:

```bash
npm run search "autodidact definition" --preset fast -n 3
```

**Configuration:**
- Only 5 claims analyzed per result
- Faster matching (25% overlap)
- Citation-focused scoring (50% weight)

**When to use:**
- Quick fact-checking
- Definitions
- Time-sensitive queries
- Initial assessments

### Example 5: Custom Fine-Tuning

Override specific parameters while using a preset:

```bash
# Start with balanced, but require 90% verification
npm run search "query" --preset balanced --verification-threshold 90

# Lenient but with stricter citation matching
npm run search "query" --preset lenient --min-overlap 35

# Etymology preset with stricter consistency
npm run search "query" --preset etymology --consistency-threshold 90
```

### Example 6: View Current Configuration

See what parameters are being used:

```bash
# Show default config
npm run search "query" --show-config

# Show strict config
npm run search "query" --preset strict --show-config

# Show custom config
npm run search "query" --config myconfig.json --show-config
```

## Custom Configuration Files

### Creating a Custom Config

Create a JSON file with your preferred settings:

**my-config.json:**
```json
{
  "citationGrounding": {
    "minKeywordOverlap": 0.35,
    "verificationThreshold": 0.85,
    "maxClaimsToAnalyze": 15
  },
  "selfConsistency": {
    "minSimilarity": 0.35,
    "consistencyThreshold": 0.85
  },
  "hallucination": {
    "vagueLanguageThreshold": 2,
    "unsupportedClaimsThreshold": 0.25,
    "lowRiskThreshold": 0.25,
    "mediumRiskThreshold": 0.55
  },
  "confidence": {
    "citationWeight": 0.35,
    "qualityWeight": 0.35,
    "verificationWeight": 0.30
  },
  "thresholds": {
    "excellent": 0.85,
    "good": 0.65,
    "fair": 0.45
  }
}
```

**Usage:**
```bash
npm run search "query" --config my-config.json
```

### Example Custom Configs

#### High-Confidence Histor Verification

**historical-research.json:**
```json
{
  "citationGrounding": {
    "minKeywordOverlap": 0.4,
    "verificationThreshold": 0.9
  },
  "hallucination": {
    "dateGapThreshold": 500,
    "lowRiskThreshold": 0.2
  }
}
```

#### Fast Exploratory

**quick-scan.json:**
```json
{
  "citationGrounding": {
    "maxClaimsToAnalyze": 5,
    "minKeywordOverlap": 0.25
  },
  "confidence": {
    "citationWeight": 0.5,
    "qualityWeight": 0.25,
    "verificationWeight": 0.25
  }
}
```

## Parameter Tuning Guide

### Citation Grounding

**minKeywordOverlap** (default: 30%)
- Lower (20-25%): More claims verified, possible false positives
- Higher (35-45%): Fewer false positives, stricter matching
- Recommendation: 30-35% for most research

**verificationThreshold** (default: 80%)
- Lower (60-75%): Accept more results, exploratory phase
- Higher (85-95%): Require high verification, formal work
- Recommendation: 80-85% for reliable research

**maxClaimsToAnalyze** (default: 10)
- Lower (5-7): Faster processing
- Higher (15-20): More thorough analysis
- Recommendation: 10 for balanced approach

### Self-Consistency

**minSimilarity** (default: 30%)
- Lower (20-25%): Detect more contradictions
- Higher (35-45%): Only flag clear contradictions
- Recommendation: 30-35% for cross-validation

**consistencyThreshold** (default: 85%)
- Lower (70-80%): Accept varied perspectives
- Higher (90-95%): Require strong agreement
- Recommendation: 85% for factual content

### Hallucination Detection

**vagueLanguageThreshold** (default: 3 phrases)
- Lower (1-2): Very sensitive to hedging
- Higher (4-6): More tolerance for uncertainty
- Recommendation: 2-3 for academic work

**unsupportedClaimsThreshold** (default: 30%)
- Lower (20-25%): Stricter claim verification
- Higher (35-45%): More tolerance for inference
- Recommendation: 25-30% for balanced approach

**Risk Thresholds**
- **lowRiskThreshold** (default: 30%): Below = low risk
- **mediumRiskThreshold** (default: 60%): Above = high risk
- Adjust based on how conservative you want flagging

### Confidence Scoring

**Weights** (must total 1.0)
- **citationWeight** (default: 40%): Source quantity/quality
- **qualityWeight** (default: 30%): Response depth/technical content
- **verificationWeight** (default: 30%): Verification results

**Adjust based on priorities:**
- Academic: 50% citation, 25% quality, 25% verification
- Technical: 30% citation, 50% quality, 20% verification
- Quick: 60% citation, 20% quality, 20% verification

## Scenario-Based Recommendations

### PhD Dissertation Research
```bash
--preset strict --min-overlap 40 --verification-threshold 92 -n 10
```

### Blog Post Research
```bash
--preset balanced -n 5
```

### Fact-Checking
```bash
--preset fast -n 3
```

### Cross-Cultural Comparison
```bash
--preset lenient --consistency-threshold 75 -n 7
```

### Technical Linguistics
```bash
--preset etymology --min-overlap 40 -n 8
```

## Testing Your Configuration

### Compare Presets

```bash
# Run same query with different presets
npm run search "autodidact etymology" --preset strict > strict-results.txt
npm run search "autodidact etymology" --preset lenient > lenient-results.txt

# Compare verification scores
diff strict-results.txt lenient-results.txt
```

### Find Optimal Settings

Start with balanced, then adjust based on results:

1. **Too many false positives?** Increase `minKeywordOverlap`
2. **Too strict?** Decrease `verificationThreshold`
3. **Missing contradictions?** Decrease `minSimilarity`
4. **Too many flags?** Increase risk thresholds

### Validation Workflow

```bash
# Test with known accurate content
npm run search "well-documented topic" --preset strict

# If verification > 85%: Config is appropriate
# If verification < 75%: Config may be too strict
```

## Tips

1. **Start with presets**, customize only if needed
2. **Use strict for citations**, balanced for drafts
3. **Lower thresholds for exploratory** research
4. **Document your config** for reproducibility
5. **Test on known content** to validate settings

## See Also

- [VERIFICATION_GUIDE.md](VERIFICATION_GUIDE.md) - How verification works
- [README.md](../README.md) - Main documentation
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Technical details

---

For questions or suggestions, please open an issue on GitHub.
