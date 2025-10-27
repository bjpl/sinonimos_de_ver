# GOALIE-X Verification - Quick Reference

## Installation

```bash
npm install
npm test  # Verify installation
```

## Basic Commands

```bash
# Default verified search (balanced preset)
npm run search "autodidact etymology"

# Quick unverified search
npm run search-basic "autodidact etymology"

# Analyze queries without executing
npm run analyze "query"
```

## Verification Presets

| Preset | Citation Overlap | Verification Threshold | Use Case |
|--------|------------------|------------------------|----------|
| **strict** | 40% | 90% | Academic papers, dissertations |
| **balanced** | 30% | 80% | General research (default) |
| **lenient** | 20% | 70% | Exploratory research |
| **fast** | 25% | 60% | Quick fact-checking |
| **etymology** | 35% | 85% | Linguistic/etymology research |

### Usage

```bash
npm run search "query" -- --preset strict
npm run search "query" -- --preset lenient
```

## Custom Configuration

### CLI Parameters

```bash
# Fine-tune specific parameters
npm run search "query" -- --min-overlap 40
npm run search "query" -- --verification-threshold 90
npm run search "query" -- --consistency-threshold 85

# Combine preset with overrides
npm run search "query" -- --preset balanced --min-overlap 35

# View current configuration
npm run search "query" -- --show-config
```

### Config File

Create `my-config.json`:
```json
{
  "citationGrounding": {
    "minKeywordOverlap": 0.35,
    "verificationThreshold": 0.85
  },
  "selfConsistency": {
    "consistencyThreshold": 0.85
  }
}
```

Use it:
```bash
npm run search "query" -- --config my-config.json
```

## Interpreting Results

### Citation Grounding
- **> 85%**: Excellent - Most claims supported
- **75-85%**: Good - Acceptable verification
- **60-75%**: Fair - Review unsupported claims
- **< 60%**: Poor - High risk

### Self-Consistency
- **> 90%**: Excellent - Strong agreement
- **80-90%**: Good - Minor discrepancies
- **70-80%**: Fair - Some contradictions
- **< 70%**: Poor - Significant disagreements

### Hallucination Risk
- **Low**: Results appear factual and well-sourced
- **Medium**: Some warning signs, review recommended
- **High**: Multiple red flags, use with caution

### Confidence Scores
- **80-100%**: Excellent - High confidence
- **60-79%**: Good - Generally reliable
- **40-59%**: Fair - Needs review
- **< 40%**: Poor - Use with caution

## Common Workflows

### Academic Research
```bash
npm run search "topic" -- --preset strict -n 7 --mode academic
```

### Quick Fact-Check
```bash
npm run search "topic" -- --preset fast -n 3
```

### Etymology Study
```bash
npm run search "word etymology" -- --preset etymology -n 5
```

### Exploratory Research
```bash
npm run search "broad topic" -- --preset lenient -n 5
```

## Output Files

Results saved to `docs/research/`:
- `verified-research-[timestamp].json` - Structured data
- `verified-research-[timestamp].md` - Human-readable report

## Adjusting Parameters

### Too Strict?
- Use `--preset lenient`
- Lower `--verification-threshold`
- Lower `--min-overlap`

### Too Lenient?
- Use `--preset strict`
- Increase `--verification-threshold`
- Increase `--min-overlap`

### Missing Contradictions?
- Increase `--consistency-threshold`
- Use more queries (`-n 7+`)

## Environment Variables

Create `.env` file:
```bash
PERPLEXITY_API_KEY=pplx-your-key-here
PERPLEXITY_MODEL=sonar-pro
SEARCH_MODE=academic
OUTPUT_DIR=docs/research
```

## Troubleshooting

### Low Verification Scores
1. Increase query count: `-n 7`
2. Use academic mode: `--mode academic`
3. Check if topic has good sources

### High Hallucination Risk
1. Review flagged results manually
2. Use stricter preset
3. Cross-reference with primary sources

### Slow Performance
1. Reduce queries: `-n 3`
2. Use fast preset: `--preset fast`
3. Disable verification: `--no-verify`

## Help

```bash
# Full help
node goalie-x-verified.mjs --help

# Search command help
node goalie-x-verified.mjs search --help

# Show configuration
node goalie-x-verified.mjs search "test" --show-config
```

## Documentation

- [VERIFICATION_GUIDE.md](VERIFICATION_GUIDE.md) - How verification works
- [CONFIGURATION_EXAMPLES.md](CONFIGURATION_EXAMPLES.md) - Detailed examples
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Technical details
- [README.md](../README.md) - Main documentation

## Support

GitHub Issues: https://github.com/ruvnet/claude-flow

---

**Quick Start:** `npm run search "your query"` - That's it!
