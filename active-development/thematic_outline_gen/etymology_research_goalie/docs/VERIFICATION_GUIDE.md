# GOALIE-X Verification Guide

## Overview

GOALIE-X now includes comprehensive verification workflows based on cutting-edge research in LLM hallucination mitigation and citation grounding. This guide explains how to use these features for accurate, reliable research.

## 🔒 Verification Features

### 1. Citation Grounding
Verifies that claims in research results are backed by actual sources.

**How it works:**
- Extracts factual claims from each result
- Checks if each claim has supporting citations
- Flags unsupported claims for review
- Provides verification rate (verified/total claims)

**Benefits:**
- Reduces hallucinations
- Ensures scholarly rigor
- Identifies weak evidence

### 2. Self-Consistency Validation
Checks consistency across multiple related queries using majority voting.

**How it works:**
- Groups similar queries together
- Compares results for consistency
- Identifies contradictions
- Calculates consistency score

**Benefits:**
- Catches factual errors
- Identifies conflicting information
- Improves reliability through consensus

### 3. Anti-Hallucination Detection
Detects patterns indicative of AI hallucinations.

**How it works:**
- Checks for vague language ("possibly", "might", "some say")
- Identifies claims without citation support
- Detects inconsistent facts (date mismatches, etc.)
- Calculates overall hallucination risk

**Risk Levels:**
- **Low** (< 30%): High confidence results
- **Medium** (30-60%): Review recommended
- **High** (> 60%): Significant concerns

### 4. Confidence Scoring
Assigns confidence scores based on multiple factors.

**Scoring Factors:**
- **Citations (40%)**: Number and quality of sources
- **Response Quality (30%)**: Depth and technical content
- **Verification (30%)**: Results from other checks

**Score Interpretation:**
- 80-100%: Excellent - High confidence
- 60-79%: Good - Generally reliable
- 40-59%: Fair - Needs review
- < 40%: Poor - Use with caution

## 📋 Usage

### Basic Verified Search
```bash
# Run with all verification enabled (default)
node goalie-x-verified.mjs search "autodidact etymology"

# Or use npm script
npm run search "autodidact etymology"
```

### Disable Verification
```bash
# If you need faster results without verification
node goalie-x-verified.mjs search "query" --no-verify

# Or use basic version
npm run search-basic "query"
```

### Control Query Count
```bash
# More queries = better verification (more cross-validation)
node goalie-x-verified.mjs search "query" -n 7

# Fewer queries = faster but less verification
node goalie-x-verified.mjs search "query" -n 3
```

### Output Options
```bash
# Save as both JSON and Markdown (default)
node goalie-x-verified.mjs search "query" -f both

# JSON only (for programmatic use)
node goalie-x-verified.mjs search "query" -f json

# Markdown only (for reading)
node goalie-x-verified.mjs search "query" -f markdown
```

## 📊 Understanding Verification Output

### Console Output
```
🔒 Verification Results:
  • Citation grounding: 42/50 claims verified (84%)
  • Self-consistency: 87.5% consistent
  • Hallucination risk: low
  • Overall confidence: 78.3%
```

### Markdown Report Structure
```markdown
# Verified Etymology and Cultural History Research

## 🔒 Verification Summary
- Citation Grounding: 42/50 claims verified (84%)
- Self-Consistency: 87.5% consistent
- Hallucination Risk: low
- Overall Confidence: 78.3%

## 📊 Confidence Scores
[Table showing confidence for each query]

## [Research Results]
[Each result includes verification badge]

## 🔍 Citation Grounding Analysis
[Details on verified/unverified claims]

## 🎯 Self-Consistency Analysis
[Consistency score and any contradictions found]

## ⚠️ Hallucination Risk Assessment
[Risk level and flagged results]

## 📚 All Citations
[Complete list of all sources]
```

### JSON Output Structure
```json
{
  "synthesis": {
    "totalQueries": 5,
    "successfulQueries": 5,
    "content": { ... },
    "citations": [ ... ]
  },
  "verification": {
    "totalResults": 5,
    "citationGrounding": {
      "total": 50,
      "verified": 42,
      "unverified": 8,
      "details": [ ... ]
    },
    "selfConsistency": {
      "score": 0.875,
      "contradictions": [ ... ],
      "agreements": [ ... ]
    },
    "hallucinationDetection": {
      "riskLevel": "low",
      "score": 0.23,
      "flags": [ ... ]
    },
    "confidenceScores": {
      "overall": 0.783,
      "byQuery": [ ... ]
    }
  }
}
```

## 🎯 Best Practices

### For Accurate Research

1. **Use 5-7 queries** for comprehensive coverage with good verification
   ```bash
   npm run search "topic" -n 7
   ```

2. **Always use academic mode** for scholarly research
   ```bash
   npm run search "topic" --mode academic
   ```

3. **Review flagged results** - Check items with:
   - Low confidence scores (< 60%)
   - High hallucination risk
   - Unverified claims

4. **Cross-reference contradictions** - Investigate any inconsistencies found

### For Quick Research

1. **Use 3 queries** for faster results
   ```bash
   npm run search "topic" -n 3
   ```

2. **Skip verification** if speed is critical
   ```bash
   npm run search-basic "topic"
   ```

3. **Use web mode** instead of academic
   ```bash
   npm run search "topic" --mode web
   ```

## 🔬 Example: Etymology Research

```bash
# Comprehensive verified etymology research
npm run search "autodidact etymology cultural history" -n 7 --mode academic

# Quick etymology check
npm run search "autodidact Greek origin" -n 3
```

**Expected Output:**
- 7 specialized queries generated
- ~50-70 claims analyzed
- 10-20 citations collected
- Verification score: 75-85%
- Confidence: 70-80%

## 📈 Verification Metrics Interpretation

### Citation Grounding Rate
- **> 80%**: Excellent - Most claims supported
- **60-80%**: Good - Acceptable level
- **40-60%**: Fair - Review unsupported claims
- **< 40%**: Poor - High risk of unsupported information

### Self-Consistency Score
- **> 85%**: Excellent - Results agree well
- **70-85%**: Good - Minor discrepancies
- **50-70%**: Fair - Some contradictions
- **< 50%**: Poor - Significant disagreements

### Hallucination Risk
- **Low**: Results appear factual and well-sourced
- **Medium**: Some warning signs, review recommended
- **High**: Multiple red flags, use with caution

## 🛠️ Troubleshooting

### Low Verification Scores

**Problem:** Citation grounding < 60%

**Solutions:**
1. Use more queries (-n 7 or higher)
2. Use academic mode
3. Refine query to be more specific
4. Check if topic has sufficient scholarly sources

### High Hallucination Risk

**Problem:** Risk level shows "high"

**Solutions:**
1. Review flagged results carefully
2. Increase query count for more cross-validation
3. Use more specific queries
4. Verify claims manually against sources

### Contradictory Results

**Problem:** Self-consistency < 70%

**Solutions:**
1. Check if queries are about same topic
2. Review contradictions in detail
3. Consult primary sources
4. May indicate genuine scholarly disagreement

## 🧪 Testing Verification

### Test Basic Verification
```bash
# Should show verification enabled
npm run test-search
```

### Test Without Verification
```bash
# Should be faster, no verification output
npm run test-search-basic
```

### Compare Results
```bash
# Run both and compare output files
npm run test-search
npm run test-search-basic

# Check docs/research/ for timestamped files
```

## 📚 Research Foundation

Based on peer-reviewed research:

1. **Citation Grounding**: AGREE framework (NAACL 2024)
   - Fine-grained citation tracking
   - 30%+ improvement over baseline methods

2. **Anti-Hallucination**: Comprehensive Survey (arXiv 2401.01313)
   - RAG techniques
   - Multiple verification layers

3. **Self-Consistency**: Majority Voting Methods
   - Cross-validation across responses
   - Consensus-based verification

## 🔗 Related Documentation

- [README.md](../README.md) - Main documentation
- [GOALIE-X-README.md](../GOALIE-X-README.md) - Core features
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Technical details

## 💡 Tips

1. **More queries = better verification** but slower execution
2. **Academic mode** has better sources but may be slower
3. **Review all flagged items** - don't ignore warnings
4. **Save JSON output** for programmatic analysis
5. **Compare multiple runs** to check consistency

## 🚀 Next Steps

After running verified research:

1. **Review verification summary** at top of output
2. **Check confidence scores** for each result
3. **Investigate flagged items** with low scores
4. **Cross-reference contradictions** if any found
5. **Cite sources properly** using provided citations
6. **Document uncertainty** where verification is weak

---

For more information, see the main [README.md](../README.md) or run:
```bash
node goalie-x-verified.mjs --help
```
